using System.IO;
using System.Text;

namespace GenData
{
    internal class FileModel
    {
        private static readonly object _lockFile = new object();

        /// <summary>
        /// 保存文件
        /// </summary>
        /// <param name="fileFullPath"></param>
        /// <param name="context"></param>
        public static void Save(string fileFullPath, string context)
        {
            lock (_lockFile)
            {
                RetryCreateDirectory();
                using (StreamWriter sw = new StreamWriter(fileFullPath, false, Encoding.UTF8))
                {
                    sw.Write(context);
                    sw.Close();
                }
            }
        }

        private static void RetryCreateDirectory()
        {
            string directory = Const.JsBaseDirectoryPath;
            if (!Directory.Exists(directory))
                Directory.CreateDirectory(directory);
        }
    }
}
