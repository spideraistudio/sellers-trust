import { reportDb } from "./report-store";
import { mongoDb } from "./sql-mongo";

export type AdminCounts={pendingMembers:number;approvedMembers:number;pendingReports:number;approvedReports:number;rejectedReports:number;pendingResolutions:number;openDisputes:number;resolvedDisputes:number;totalDisputedPaise:number;openDisputedPaise:number;resolvedDisputedPaise:number;pendingPasswordResets:number;expiringMemberships:number;unusualLast24:number};
export type AuditEntry={source:string;action:string;actor:string;subject:string;details:string|null;created_at:number};

export async function adminCounts():Promise<AdminCounts>{
  const db=await mongoDb();
  const now=Date.now();
  const expireUntil=now+30*24*60*60*1000;
  const last24=now-24*60*60*1000;
  const [pendingMembers,approvedMembers,pendingReports,approvedReports,rejectedReports,pendingResolutions,openDisputes,resolvedDisputes,pendingPasswordResets,unusualLast24,disputeTotals,expiringMemberships]=await Promise.all([
    db.collection("members").countDocuments({$or:[{status:"pending"},{status:{$in:[null,""]}},{status:{$exists:false}}]}),
    db.collection("members").countDocuments({status:"approved"}),
    db.collection("seller_reports").countDocuments({$or:[{status:"pending"},{status:{$in:[null,""]}},{status:{$exists:false}}]}),
    db.collection("seller_reports").countDocuments({status:"approved"}),
    db.collection("seller_reports").countDocuments({status:"rejected"}),
    db.collection("dispute_resolution_requests").countDocuments({status:"pending"}),
    db.collection("seller_reports").countDocuments({status:"approved",dispute:1,dispute_resolved:{$ne:1}}),
    db.collection("seller_reports").countDocuments({status:"approved",dispute:1,dispute_resolved:1}),
    db.collection("password_reset_requests").countDocuments({status:"pending"}),
    db.collection("security_events").countDocuments({severity:"warning",created_at:{$gte:last24}}),
    db.collection("seller_reports").aggregate<{total:number;resolved:number;open:number}>([
      {$match:{status:"approved",dispute:1}},
      {$group:{
        _id:null,
        total:{$sum:{$ifNull:["$amount_paise",0]}},
        resolved:{$sum:{$ifNull:["$resolved_amount_paise",0]}},
        open:{$sum:{$max:[0,{$subtract:[{$ifNull:["$amount_paise",0]},{$ifNull:["$resolved_amount_paise",0]}]}]}},
      }},
    ]).next(),
    db.collection("members").countDocuments({
      status:"approved",
      $expr:{
        $let:{
          vars:{ends:{$ifNull:["$subscription_ends_at","$trial_ends_at"]}},
          in:{$and:[{$gte:["$$ends",now]},{$lte:["$$ends",expireUntil]}]},
        },
      },
    }),
  ]);
  return {
    pendingMembers,
    approvedMembers,
    pendingReports,
    approvedReports,
    rejectedReports,
    pendingResolutions,
    openDisputes,
    resolvedDisputes,
    totalDisputedPaise:Number(disputeTotals?.total||0),
    openDisputedPaise:Number(disputeTotals?.open||0),
    resolvedDisputedPaise:Number(disputeTotals?.resolved||0),
    pendingPasswordResets,
    expiringMemberships,
    unusualLast24,
  };
}

export async function auditEntries(limit=500):Promise<AuditEntry[]>{const result=await reportDb().prepare(`SELECT source,action,actor,subject,details,created_at FROM (
 SELECT 'membership' source,a.action,CASE WHEN a.actor_user_id LIKE 'member:%' THEN COALESCE(m.company_name,'Member') WHEN a.action='member.registered' THEN COALESCE(m.company_name,'Applicant') ELSE 'Administrator' END actor,COALESCE(m.company_name,'Company membership') subject,a.details,a.created_at created_at FROM audit_logs a LEFT JOIN members m ON m.id=a.target_member_id
 UNION ALL
 SELECT 'seller report' source,a.action,CASE WHEN a.actor LIKE 'member:%' THEN COALESCE(m.company_name,'Member') ELSE 'Administrator' END actor,COALESCE(r.firm_name,'Seller report') subject,NULL details,a.created_at created_at FROM report_audit a LEFT JOIN seller_reports r ON r.id=a.report_id LEFT JOIN members m ON m.id=r.member_id
 UNION ALL
 SELECT 'security' source,e.event_type action,COALESCE(m.company_name,'Public visitor') actor,COALESCE(e.details,'Security event') subject,CONCAT('Network ref: ',substr(COALESCE(e.network_hash,'unknown'),1,10)) details,e.created_at created_at FROM security_events e LEFT JOIN members m ON m.id=e.member_id
 ) AS activity ORDER BY created_at DESC LIMIT ?`).bind(limit).all<AuditEntry>();return result.results;}

export function actionLabel(action:string){return ({"member.registered":"Company registered","member.approved":"Company reactivated","member.rejected":"Company rejected","member.deactivated":"Company deactivated","member.approved_credentials_issued":"Membership approved and credentials issued","member.credentials_reset":"Member credentials reset","member.password_changed":"Member changed password","admin.export_members":"Member records exported","admin.export_reports":"Approved reports exported",submitted:"Seller report submitted",edited:"Pending report edited",revision_requested:"Approved report change requested",approved:"Seller report approved",rejected:"Seller report rejected",resolution_requested:"Dispute resolution requested",resolution_approved:"Dispute resolution approved",resolution_rejected:"Dispute resolution rejected",repeated_failed_login:"Repeated failed login attempts",concurrent_login_replaced:"Earlier member session replaced",gstin_search_rate_limited:"Excessive GSTIN searches blocked",registration_rate_limited:"Excessive registrations blocked",repeated_invalid_upload:"Repeated invalid uploads",duplicate_seller_submission:"Duplicate seller submission blocked"} as Record<string,string>)[action]||action.replaceAll("_"," ").replaceAll("."," ");}
