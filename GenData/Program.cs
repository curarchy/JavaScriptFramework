using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Sunrise.Spell;

namespace GenData
{
    class Program
    {
        static void Main(string[] args)
        {
            string result = AirportModel.GetDataString();
            result = "var airport = \"" + result + "\";";
            FileModel.Save(Const.JsBaseDirectoryPath + "airport.js", result);
        }
    }
}
