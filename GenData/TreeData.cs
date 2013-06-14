using System.Collections.Generic;
using InfoSky.UnifiedData.ClientModel.BasicData;
using InfoSky.UnifiedData.Services.ServiceInterfaces.DataContracts;
using InfoSky.Framework.Common.Util;

namespace GenData
{
    public class TreeData
    {
        public static string BuildTree()
        {
            List<CityAirportData> result = City.GetCityInfoCollection(Const.CompanyCode);

            List<TreeNode> nodes = BuildTreeView(result);

            return JsonUtils.Serialize(nodes);
        }

        public static List<TreeNode> BuildTreeView(List<CityAirportData> data)
        {
            List<TreeNode> result = new List<TreeNode>();

            data.ForEach(e =>
            {
                if (e.Airport == null || e.City == null || e.Country == null)
                    return;

                var continent = e.Country.Continent;
                TreeNode continentNode = result.Find(f => f.id == continent);
                if (continentNode != null)
                {
                    TreeNode countryNode = continentNode.children.Find(g => g.id == e.Country.Code);
                    if (countryNode != null)
                    {
                        TreeNode cityNode = countryNode.children.Find(h => h.id == e.City.Code);
                        if (cityNode != null)
                        {
                            cityNode.children.Add(new TreeNode()
                            {
                                id = e.Airport.Code ?? "",
                                key = e.Airport.Code ?? "",
                                title = e.Airport.Code ?? ""
                            });
                        }
                        else
                        {
                            countryNode.children.Add(new TreeNode()
                            {
                                id = e.City.Code ?? "",
                                key = e.City.Code ?? "",
                                title = e.City.Name_CN,
                                children = new List<TreeNode>(){
                                                         new TreeNode(){
                                                             id = e.Airport.Code??"",
                                                              key = e.Airport.Code??"",
                                                               title=e.Airport.Code??""
                                                         }
                                                    }
                            });
                        }
                    }
                    else
                    {
                        continentNode.children.Add(new TreeNode()
                        {
                            id = e.Country.Code ?? "",
                            key = e.Country.Code ?? "",
                            title = e.Country.Name_CN ?? "",
                            children = new List<TreeNode>(){
                                            new TreeNode(){
                                                 id = e.City.Code??"",
                                                  key = e.City.Code??"",
                                                   title = e.City.Name_CN??"",
                                                    children = new List<TreeNode>(){
                                                         new TreeNode(){
                                                             id = e.Airport.Code??"",
                                                              key = e.Airport.Code??"",
                                                               title=e.Airport.Code??""
                                                         }
                                                    }
                                            }
                                        }
                        });
                    }
                }
                else
                {
                    result.Add(new TreeNode()
                    {
                        title = e.Country.Continent ?? "",
                        id = e.Country.Continent ?? "",
                        key = e.Country.Continent ?? "",
                        children = new List<TreeNode>(){
                                 new TreeNode(){
                                     id = e.Country.Code??"",
                                      key = e.Country.Code??"",
                                       title = e.Country.Name_CN??"",
                                        children = new List<TreeNode>(){
                                            new TreeNode(){
                                                 id = e.City.Code??"",
                                                  key = e.City.Code??"",
                                                   title = e.City.Name_CN??"",
                                                    children = new List<TreeNode>(){
                                                         new TreeNode(){
                                                             id = e.Airport.Code??"",
                                                              key = e.Airport.Code??"",
                                                               title=e.Airport.Code??""
                                                         }
                                                    }
                                            }
                                        }
                                 }
                            }
                    });
                }
            });

            return result;
        }
    }


    public class TreeNode
    {
        public string id { get; set; }
        public string key { get; set; }
        public string title { get; set; }
        public List<TreeNode> children { get; set; }
    }
}
