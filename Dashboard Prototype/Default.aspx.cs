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
        public static List<DvChart1> GetDvChart1Data()
        {
            string strSQL = GetSQL4DvChart1();
            string constr = ConfigurationManager.ConnectionStrings["constr"].ConnectionString;
            DataTable dt = new DataTable();

            using (SqlConnection con = new SqlConnection(constr))
            {
                using (SqlCommand cmd = new SqlCommand(strSQL))
                {
                    cmd.Connection = con;
                    List<DvChart1> chartData = new List<DvChart1>();
                    con.Open();
                    using (SqlDataReader sdr = cmd.ExecuteReader())
                    {
                        dt.Load(sdr);

                       foreach(DataRow drow in dt.Rows)
                        {
                            chartData.Add(new DvChart1
                            {
                                YearOfBirth = Convert.ToInt32(drow["YearOfBirth"].ToString()),
                                Male = Convert.ToInt32(drow["Male"].ToString()),
                                Female = Convert.ToInt32(drow["Female"].ToString()),
                                Not_Specified = Convert.ToInt32(drow["Not_Specified"].ToString()),
                              
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
        public static string GetSQL4DvChart1()
        {
            string strSQL = @"Select YearOfBirth,ISNULL(Male,0) as Male  ,ISNULL(Female,0) as Female
	                         ,ISNULL(Not_Specified,0) as Not_Specified from (
                                SELECT Year as YearOfBirth,Male,Female,Not_Specified FROM (
	                                select 
		                                isnull(YEAR(B.Date_of_Birth), 0) as Year
		                                , Replace(isnull(O.Gender, 'Not_Specified')
		                                , 'Please Select Gender', 'Not_Specified') as Gender
		                                , Count(*) as Headcount
		                                from WFMP.tblMaster A 
		                                left join WFMP.tblProfile B on B.Employee_ID = A.Employee_ID
		                                left join WFMP.tblGender O on O.Id = B.Gender
		                                group by 
		                                YEAR(B.Date_of_Birth)
		                                ,Replace(isnull(O.Gender, 'Not_Specified')
		                                , 'Please Select Gender', 'Not_Specified')		
	                                )   
                                    AS A
                                PIVOT  
                                (  
                                    sum(A.Headcount) FOR A.Gender IN ( [Male], [Female],[Not_Specified])
                                ) AS B  

                                ) A
                                Order by A.YearOfBirth
                                ";
            return strSQL;
        }

        public static string GetSQL4DvChart2()
        {
            string strSQL = @"select 
					isnull(YEAR(B.Date_of_Birth), 0) as Year
					, Replace(isnull(O.Gender, 'Not_Specified')
					, 'Please Select Gender', 'Not_Specified') as Gender
					, P.Designation
					, Count(*) as Headcount
					from WFMP.tblMaster A 
					left join WFMP.tblProfile B on B.Employee_ID = A.Employee_ID
					left join WFMP.tblGender O on O.Id = B.Gender
					left join WFMP.tblDesignation P on P.ID = A.DesignationID
					group by 
					YEAR(B.Date_of_Birth)
					,Replace(isnull(O.Gender, 'Not_Specified')
					, 'Please Select Gender', 'Not_Specified')
					, P.Designation";
            return strSQL;
        }
    }


 
}