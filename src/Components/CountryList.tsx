import React, { useMemo, useState } from "react";
import axios from "axios";
import {
  useReactTable,
  flexRender,
  ColumnDef,
  TableOptions,
  getCoreRowModel,
} from "@tanstack/react-table";
import "./CountryList.css";
import LazyImage from "../Helpers/LazyImage";
import populationMapper from "../Helpers/CommonHelpers";
interface Country {
  name: string;
  code: string;
  capital: string;
  phoneCode: string;
  population: number;
  flag: string;
  emblem: string;
  continent: string;
}

const CountryList: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<string>("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Country[]>(
        "https://api.sampleapis.com/countries/countries"
      );
      setCountries(response.data);
      setLoading(false);
    } catch (error) {
      setError(error as Error);
      setLoading(false);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(event.target.value);
  };

  const handleClear = () => {
    setSearch("");
    setFilter("");
  };

  const filteredCountries = useMemo(() => {
    return countries
      .filter((country) =>
        country.name.toLowerCase().includes(search.toLowerCase())
      )
      .filter((country) =>
        filter ? country.population < +populationMapper[filter] : true
      );
  }, [countries, filter, search]);

  const columns: ColumnDef<Country>[] = [
    {
      header: "Country Name",
      accessorKey: "name",
    },
    {
      header: "Code",
      accessorKey: "abbreviation",
    },
    {
      header: "Capital",
      accessorKey: "capital",
    },
    {
      header: "Phone Code",
      accessorKey: "phone",
    },
    {
      header: "Population",
      accessorKey: "population",
    },
    {
      header: "Flag",
      accessorKey: "media.flag",
      cell: ({ getValue }) => (
        // <img src={getValue<string>()} alt="flag" style={{ width: "50px" }} />
        <LazyImage
          src={getValue<string>()}
          alt={"Flag"}
          styleObj={{ width: "50px" }}
          key={getValue<string>()}
        />
      ),
    },
    {
      header: "Emblem",
      accessorKey: "media.emblem",
      cell: ({ getValue }) => (
        // <img src={getValue<string>()} alt="emblem" style={{ width: "50px" }} />
        <LazyImage
          src={getValue<string>()}
          alt={"emblem"}
          styleObj={{ width: "50px" }}
        />
      ),
    },
  ];

  const tableOptions: TableOptions<Country> = {
    data: filteredCountries,
    columns,
    getCoreRowModel: getCoreRowModel(),
  };

  const table = useReactTable(tableOptions);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="country-list-container">
      <h1 className="title">Countries Info</h1>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="controls">
            <input
              type="text"
              placeholder="Search by name"
              value={search}
              onChange={handleSearch}
              className="search-input"
            />
            <select
              value={filter}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value={"Population"}>Population</option>
              <option value={"<1 Million"}>{"<1 Million"}</option>
              <option value={"<5 Million"}>{"<5 Million"}</option>
              <option value={"<10 Million"}>{"<10 Million"}</option>
            </select>
            <button onClick={handleClear} className="clear-button">
              Clear
            </button>
            <button onClick={fetchData} className="show-all-button">
              Show all Countries
            </button>
          </div>
          <table className="country-table">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} style={{ height: "75px" }}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default CountryList;
