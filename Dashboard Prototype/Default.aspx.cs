using System;
using System.Collections.Generic;
using System.Web.Services;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;

namespace Dashboard_Prototype
{
    public partial class Default : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod]
        public static List<DataDB> GetChartData(string chartNum = "")
        {
            string strSQL = string.Empty;
            int chartNumber = Convert.ToInt32(chartNum);
            strSQL = GetOverAllSQL();
            string constr = ConfigurationManager.ConnectionStrings["constr"].ConnectionString;
            DataTable dt = new DataTable();

            using (SqlConnection con = new SqlConnection(constr))
            {
                using (SqlCommand cmd = new SqlCommand(strSQL))
                {
                    cmd.Connection = con;
                    List<DataDB> chartData = new List<DataDB>();
                    con.Open();
                    using (SqlDataReader sdr = cmd.ExecuteReader())
                    {
                        dt.Load(sdr);
                        var columns = dt.Columns;
                        foreach (DataRow drow in dt.Rows)
                        {
                            chartData.Add(new DataDB
                            {
                                YearOfBirth = columns.Contains("YearOfBirth") ? drow["YearOfBirth"].ToString() : null,
                                Gender = columns.Contains("Gender") ? drow["Gender"].ToString() : null,
                                Department = columns.Contains("Department") ? drow["Department"].ToString() : null,
                                Role = columns.Contains("Role") ? drow["Role"].ToString() : null,
                                Level = columns.Contains("Level") ? drow["Level"].ToString() : null,
                                HeadCount = columns.Contains("HeadCount") ? Convert.ToInt32(drow["HeadCount"].ToString()) : 0
                            });
                        }
                    }
                    con.Close();
                    return chartData;
                }
            }
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

        public static string GetOverAllSQL()
        {
            string strSQL = @"select 
                        isnull(YEAR(B.Date_of_Birth), 0) as YearOfBirth
                        , Replace(isnull(O.Gender, 'Not_Specified'), 'Please Select Gender', 'Not_Specified') as Gender
                        , case when C.Designation in ('Site Director','Officer','Sr. Officer') then 'Administration'
                        when C.Designation in ('Mgr I Workforce Mgmt','Mgr II Workforce Mgmt','Sr Mgr Workforce Mgmt') then 'Management'
                        when C.Designation in ('Analyst','Real-Time Analyst','Sr. Analyst') then 'GCC'
                        when C.Designation in ('WF Planner') then 'Planning'
                        when C.Designation in ('Scheduler', 'Primary Scheduler', 'Secondary Scheduler') then 'Scheduling'
                        when C.Designation in ('Sr. Software Developer') then 'Analytics' 
                        when C.Designation is Null then 'Not_Specified'
                        end as Department
                        , case when C.Designation in ('Site Director','Officer','Sr. Officer') then 'Director'
                        when C.Designation in ('Officer','Sr. Officer') then 'Officer'
                        when C.Designation in ('Mgr I Workforce Mgmt','Mgr II Workforce Mgmt','Sr Mgr Workforce Mgmt') then 'Manager'
                        when C.Designation in ('Analyst','Real-Time Analyst','Sr. Analyst') then 'Analyst'
                        when C.Designation in ('WF Planner') then 'Planner'
                        when C.Designation in ('Scheduler', 'Primary Scheduler', 'Secondary Scheduler') then 'Scheduler'
                        when C.Designation in ('Sr. Software Developer') then 'Developer' 
                        when C.Designation is Null then 'Not_Specified'
                        end as Role
                        , isnull(D.Level,'Not_Specified') as Level
                        , Count(*) as Headcount
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
                        group by 
                        isnull(YEAR(B.Date_of_Birth), 0)
                        , isnull(O.Gender, 'Not_Specified')
                        , case when C.Designation in ('Site Director','Officer','Sr. Officer') then 'Administration'
                        when C.Designation in ('Mgr I Workforce Mgmt','Mgr II Workforce Mgmt','Sr Mgr Workforce Mgmt') then 'Management'
                        when C.Designation in ('Analyst','Real-Time Analyst','Sr. Analyst') then 'GCC'
                        when C.Designation in ('WF Planner') then 'Planning'
                        when C.Designation in ('Scheduler', 'Primary Scheduler', 'Secondary Scheduler') then 'Scheduling'
                        when C.Designation in ('Sr. Software Developer') then 'Analytics' 
                        when C.Designation is Null then 'Not_Specified'
                        end 
                        , case when C.Designation in ('Site Director','Officer','Sr. Officer') then 'Director'
                        when C.Designation in ('Officer','Sr. Officer') then 'Officer'
                        when C.Designation in ('Mgr I Workforce Mgmt','Mgr II Workforce Mgmt','Sr Mgr Workforce Mgmt') then 'Manager'
                        when C.Designation in ('Analyst','Real-Time Analyst','Sr. Analyst') then 'Analyst'
                        when C.Designation in ('WF Planner') then 'Planner'
                        when C.Designation in ('Scheduler', 'Primary Scheduler', 'Secondary Scheduler') then 'Scheduler'
                        when C.Designation in ('Sr. Software Developer') then 'Developer' 
                        when C.Designation is Null then 'Not_Specified'
                        end
                        , isnull(D.Level,'Not_Specified')
                        order by 1,2,3,4,5";
            return strSQL;
        }

    }



}