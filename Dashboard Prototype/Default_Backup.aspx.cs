using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Data.SqlClient;
using System.Data.Sql;
using System.Configuration;

namespace Dashboard_Prototype
{
    public partial class Default_Backup : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }


        [WebMethod]
        public static List<DvChart1> GetDvChart1Data()
        {
            //string strSQL = GetSQL4DvChart1();
            //string constr = ConfigurationManager.ConnectionStrings["constr"].ConnectionString;
            //DataTable dt = new DataTable();

            //using (SqlConnection con = new SqlConnection(constr))
            //{
            //    using (SqlCommand cmd = new SqlCommand(strSQL))
            //    {
            //        cmd.Connection = con;
                    List<DvChart1> chartData = new List<DvChart1>();
            //        con.Open();
            //        using (SqlDataReader sdr = cmd.ExecuteReader())
            //        {
            //            dt.Load(sdr);

            //            for (int i = 0; i < dt.Rows.Count; i++)
            //            {
            //                for (int j = 0; j < dt.Columns.Count - 1; j++)
            //                {
            //                    if (dt.Rows[i][j] != null || dt.Rows[i][j].ToString() != string.Empty)
            //                    {
            //                        chartData.Add(new DvChart1
            //                        {
            //                            id = dt.Rows[i][j].ToString(),
            //                            parent = dt.Rows[i][j - 1].ToString(),
            //                            name = dt.Rows[i][j].ToString(),
            //                            value = Convert.ToInt32(dt.Rows[i][4])
            //                        });
            //                    }

            //                }

            //            }


            //        }
            //        con.Close();
                    return chartData;
            //    }
            //}
        }

        public string getStrSQL()
        {
            string strSQL = @" select A.Employee_ID, dbo.getFullName(A.Employee_ID) as Name, C.Designation as DesignationID, A.LevelID as LevelIDnumber
	        , D.Level as LevelID, A.DOJ, A.DOP, A.DOR, A.DPT, A.DOPS, E.EmpStatus, H.TrngStatus
	        , I.Type as Job_Type, J.Level as CountryID, K.Site as SiteID, L.[Function] as FunctionId, M.LOB as LOBID, F.SkillSet
	        , G.SubSkillSet, A.RepMgrCode, N.RepMgrCode as RevMgrCode, A.TeamID, A.ntName, A.ResType
	        , A.BusinessID, A.Employee_ID, B.Date_of_Birth, O.Gender, A.Email_Office
	        , B.Email_Personal, B.Contact_Number, P.MaritalStatus, B.AnniversaryDate, Q.Qualification
	        , B.Transport, B.Address1, B.Address2, B.Landmark, B.Role, B.Total_Work_Experience
	        , B.Skill1, B.Skill2, B.Skill3, B.Alternate_Contact, B.EmergencyContactNo, B.EmergencyContactPerson
	        , B.UserImage, B.Updated_by, B.Update_Date
	        , A.DeptLinkId, dbo.getFullName(N.Employee_ID) as ReportingMgrName
	        from WFMP.tblMaster A 
	        left join WFMP.tblProfile B on B.Employee_ID = A.Employee_ID
	        left join WFMP.tblDesignation C on C.ID = A.DesignationID
	        left join WFMP.tblLevel D on D.LevelID = A.LevelID
	        left join WFMP.tblEmpStatus E on E.Id = A.EmpStatus
	
	        left join WFMP.tblDepartmentLinkMst TDLM on TDLM.[TransID] = A.[DeptLinkId] AND TDLM.Active=1
	        Left Join WFMP.tblDepartment TD on TD.[TransID] = TDLM.[DepartmentID] AND TDLM.Active=1
	        left join WFMP.tblFunction L on L.TransID = TDLM.[FunctionID] AND TDLM.Active=1
	        left join WFMP.tblLOB M on M.TransID = TDLM.[LOBID] AND TDLM.Active=1
	        left join WFMP.tblSkillSet F on F.TransID = TDLM.[SkillSetID] AND TDLM.Active=1
	        left join WFMP.tblSubSkillSet G on G.TransID = TDLM.[SubSkillSetID] AND TDLM.Active=1
	
	        left join WFMP.tblTrainingStatus H on H.TransID = A.TrngStatus
	        left join WFMP.tblJob_Type I on I.Id = A.Job_Type
	        left join WFMP.tblCountry J on J.TransID = A.CountryID
	        left join WFMP.tblSite K on K.TransID = A.SiteID
	        left join WFMP.tblMaster N on A.RepMgrCode=N.Employee_ID
	        left join WFMP.tblGender O on O.Id = B.Gender
	        left join WFMP.tblMaritalStatus P on P.Id = B.MaritalStatus
	        left join WFMP.tblQualification Q on Q.Id = B.Qualification";

            return strSQL;
        }
        public static string GetSQL4DvChart1()
        {
            string strSQL = @"select Replace(isnull(O.Gender, 'Not Specified'), 'Please Select Gender', 'Not Specified') as Gender
            , case when C.Designation in ('Site Director','Officer','Sr. Officer') then 'Administration'
            when C.Designation in ('Mgr I Workforce Mgmt','Mgr II Workforce Mgmt','Sr Mgr Workforce Mgmt') then 'Management'
            when C.Designation in ('Analyst','Real-Time Analyst','Sr. Analyst') then 'GCC'
            when C.Designation in ('WF Planner') then 'Planning'
            when C.Designation in ('Scheduler', 'Primary Scheduler', 'Secondary Scheduler') then 'Scheduling'
            when C.Designation in ('Sr. Software Developer') then 'Analytics' 
            when C.Designation is Null then 'Not Specified'
            end as Department
            , case when C.Designation in ('Site Director','Officer','Sr. Officer') then 'Director'
            when C.Designation in ('Officer','Sr. Officer') then 'Officer'
            when C.Designation in ('Mgr I Workforce Mgmt','Mgr II Workforce Mgmt','Sr Mgr Workforce Mgmt') then 'Manager'
            when C.Designation in ('Analyst','Real-Time Analyst','Sr. Analyst') then 'Analyst'
            when C.Designation in ('WF Planner') then 'Planner'
            when C.Designation in ('Scheduler', 'Primary Scheduler', 'Secondary Scheduler') then 'Scheduler'
            when C.Designation in ('Sr. Software Developer') then 'Developer' 
            when C.Designation is Null then 'Not Specified'
            end as Role
            , isnull(D.Level,'Not Specified') as Level
            , Count(*) as HeadCount
            from WFMP.tblMaster A 
            left join WFMP.tblProfile B on B.Employee_ID = A.Employee_ID
            left join WFMP.tblDesignation C on C.ID = A.DesignationID
            left join WFMP.tblLevel D on D.LevelID = A.LevelID
            left join WFMP.tblEmpStatus E on E.Id = A.EmpStatus
	
            left join WFMP.tblDepartmentLinkMst TDLM on TDLM.[TransID] = A.[DeptLinkId] AND TDLM.Active=1
            Left Join WFMP.tblDepartment TD on TD.[TransID] = TDLM.[DepartmentID] AND TDLM.Active=1
            left join WFMP.tblFunction L on L.TransID = TDLM.[FunctionID] AND TDLM.Active=1
            left join WFMP.tblLOB M on M.TransID = TDLM.[LOBID] AND TDLM.Active=1
            left join WFMP.tblSkillSet F on F.TransID = TDLM.[SkillSetID] AND TDLM.Active=1
            left join WFMP.tblSubSkillSet G on G.TransID = TDLM.[SubSkillSetID] AND TDLM.Active=1
	
            left join WFMP.tblTrainingStatus H on H.TransID = A.TrngStatus
            left join WFMP.tblJob_Type I on I.Id = A.Job_Type
            left join WFMP.tblCountry J on J.TransID = A.CountryID
            left join WFMP.tblSite K on K.TransID = A.SiteID
            left join WFMP.tblMaster N on A.RepMgrCode=N.Employee_ID
            left join WFMP.tblGender O on O.Id = B.Gender
            left join WFMP.tblMaritalStatus P on P.Id = B.MaritalStatus
            left join WFMP.tblQualification Q on Q.Id = B.Qualification
            group by isnull(O.Gender, 'Not Specified')
            , case when C.Designation in ('Site Director','Officer','Sr. Officer') then 'Administration'
            when C.Designation in ('Mgr I Workforce Mgmt','Mgr II Workforce Mgmt','Sr Mgr Workforce Mgmt') then 'Management'
            when C.Designation in ('Analyst','Real-Time Analyst','Sr. Analyst') then 'GCC'
            when C.Designation in ('WF Planner') then 'Planning'
            when C.Designation in ('Scheduler', 'Primary Scheduler', 'Secondary Scheduler') then 'Scheduling'
            when C.Designation in ('Sr. Software Developer') then 'Analytics' 
            when C.Designation is Null then 'Not Specified'
            end 
            , case when C.Designation in ('Site Director','Officer','Sr. Officer') then 'Director'
            when C.Designation in ('Officer','Sr. Officer') then 'Officer'
            when C.Designation in ('Mgr I Workforce Mgmt','Mgr II Workforce Mgmt','Sr Mgr Workforce Mgmt') then 'Manager'
            when C.Designation in ('Analyst','Real-Time Analyst','Sr. Analyst') then 'Analyst'
            when C.Designation in ('WF Planner') then 'Planner'
            when C.Designation in ('Scheduler', 'Primary Scheduler', 'Secondary Scheduler') then 'Scheduler'
            when C.Designation in ('Sr. Software Developer') then 'Developer' 
            when C.Designation is Null then 'Not Specified'
            end
            , isnull(D.Level,'Not Specified')
            with rollup";

            return strSQL;
        }
    }


    public class DvChart1
    {
        public string id { get; set; }
        public string parent { get; set; }
        public string name { get; set; }
        public int value { get; set; }
    }
}