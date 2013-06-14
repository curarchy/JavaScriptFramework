using System.Collections.Generic;
using InfoSky.UnifiedData.ClientModel.BasicData;
using InfoSky.UnifiedData.Services.ServiceInterfaces.DataContracts;
using InfoSky.Framework.Common.Util;
using Sunrise.Spell;

namespace GenData
{
    public class AirportModel
    {

        public static string BaseStr = "@-|{0}|{1}|{2}|{3}";        //ie6的split不能识别空元素。。。

        public static List<AirportData> GetData()
        {
            List<AirportData> result = Airport.GetAirports(Const.CompanyCode);
            return result;
        }

        public static string GetDataString()
        {
            string result = string.Empty;

            List<AirportData> datas = GetData();
            if (ArrayUtils.HasElements(datas))
            {
                datas.ForEach(e =>
                {
                    string code = e.Code == null ? "" : e.Code.Trim();
                    string nameCN = e.Name_CN == null ? "" : e.Name_CN.Trim();
                    string nameEN = e.Name_EN == null ? "" : e.Name_EN.Trim();
                    string pinyin = Spell.MakeSpellCode(nameCN, SpellOptions.EnableUnicodeLetter);

                    code.Replace("\"",string.Empty);
                    nameCN = nameCN.Replace("\"", string.Empty);
                    nameEN = nameEN.Replace("\"", string.Empty);
                    pinyin = pinyin.Replace("\"", string.Empty);

                    result += string.Format(
                        BaseStr,
                        string.IsNullOrEmpty(nameCN)?"-":nameCN,
                        string.IsNullOrEmpty(nameEN) ? "-" : nameEN,
                        string.IsNullOrEmpty(pinyin) ? "-" : pinyin,
                        string.IsNullOrEmpty(code) ? "-" : code);
                });
            }
            return result;
        }
    }
}
