using GrapeCity.BI.Data.DataProviders;
using System;
using System.Globalization;
using System.Linq;

namespace PlantPerfomance_AngularCore
{
	public sealed class SQLiteConnectionAdapter : DbConnectionAdapter
	{
		public static SQLiteConnectionAdapter Instance = new SQLiteConnectionAdapter();

		/// <summary>
		/// Returns the string representation of a multi-value parameter's value.
		/// </summary>
		protected override string MultivalueParameterValueToString(object[] parameterArrayValue)
		{
			return string.Join(",", parameterArrayValue.Select(parameterValue => "'" + Convert.ToString(parameterValue, CultureInfo.InvariantCulture) + "'"));
		}

		/// <summary>
		/// Oracle Client command paremeters are always prefixed by : symbol, 
		/// </summary>
		/// <param name="name"></param>
		/// <returns></returns>
		protected override string CreateParameterNamePattern(string name)
		{
			if (!name.StartsWith("@"))
				name = string.Format("@{0}", name);
			return base.CreateParameterNamePattern(name);
		}
	}
}
