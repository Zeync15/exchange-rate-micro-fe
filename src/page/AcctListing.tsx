import type { ColumnDef } from "@tanstack/react-table";
import { lazy, Suspense, useEffect, useState } from "react";
import type { AcctListItem } from "../api/acctList";
import type { CurrencyRes } from "../api/exchangeRate";
import Accordion from "../component/Accordion";
import CompanyDropdown from "../component/CompanyDropdown";
import CurrencyDropdown from "../component/CurrencyDropdown";
import SearchBar from "../component/SearchBar";
import { Table } from "../component/Table";
import { AllAcctLists } from "../mock/acctList";
import { CompanyList } from "../mock/companyList";
import { CurrencyDropList, getExchangeRate } from "../mock/exchangeRate";
import { filterAccounts, formatAcctNumber } from "../utils";
import ExchangeRate from "../utils/ExchangeRate";

const AcctListing = () => {
  const DownloadButton = lazy(() => import("remote_app/DownloadButton"));
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);

  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyRes>({
    currencyCode: "",
    currencyDesc: "",
    countryName: "",
    decimalNo: 0,
  });

  const [selectedCorpId, setSelectedCorpId] = useState<number | null>(null);

  const [tableData, setTableData] = useState<AcctListItem[]>([]);

  const [searchTerm, setSearchTerm] = useState("");

  const handleCompanyChange = (selectedOption: number) => {
    if (selectedOption === 0) {
      setSelectedCompany(null);
    } else {
      setSelectedCompany(selectedOption);
    }
  };

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCode = e.target.value;

    const selected = CurrencyDropList.find(
      (item) => item.currencyCode === selectedCode
    );

    if (selected) {
      setSelectedCurrency(selected);
    } else {
      setSelectedCurrency({
        currencyCode: "",
        currencyDesc: "",
        countryName: "",
        decimalNo: 0,
      });
    }
  };

  const handleCorpIdChange = (corpId: number | null) => {
    setSelectedCorpId(corpId);
  };

  const columns: ColumnDef<AcctListItem>[] = [
    {
      accessorKey: "acctName",
      header: "Account Name",
      cell: ({ row }) => <div className="">{row.original.acctName}</div>,
    },
    {
      accessorKey: "acctNumber",
      header: "Account No.",
      cell: ({ row }) => (
        <div className="">{formatAcctNumber(row.original.acctNumber)}</div>
      ),
    },
    {
      accessorKey: "currency",
      header: "Currency",
      cell: ({ row }) => <div className="">{row.original.currency}</div>,
    },
    {
      accessorKey: "ledgerBalance",
      header: () => <div className="text-right">Balance 1</div>,
      cell: ({ row }) => {
        const { ledgerBalance, currency: rowCurrency } = row.original;

        const buyRate = getExchangeRate.find(
          (currency) => currency.currency === rowCurrency
        )?.buyRate;

        const conversionUnit = getExchangeRate.find(
          (currency) => currency.currency === rowCurrency
        )?.conversionUnit;

        return (
          <div className="flex justify-end gap-4">
            <ExchangeRate
              balance={ledgerBalance ?? "-"}
              selectedCurrency={selectedCurrency.currencyCode}
              baseCurrency={"MYR"}
              rowCurrency={rowCurrency}
              exchangeRate={
                (selectedCurrency.currencyCode !== ""
                  ? getExchangeRate.find(
                      (currency) =>
                        currency.currency === selectedCurrency.currencyCode
                    )
                  : getExchangeRate.find(
                      (currency) => currency.currency === rowCurrency
                    ))!
              }
              buyRate={buyRate!}
              conversionUnit={conversionUnit!}
            />

            {selectedCurrency.currencyCode}
          </div>
        );
      },
    },
    {
      accessorKey: "availableBalance",
      header: () => <div className="text-right">Balance 2</div>,
      cell: ({ row }) => (
        <div className="text-right ">
          {row.original.availableBalance ?? "-"}
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (selectedCorpId) {
      setTableData(
        filterAccounts(AllAcctLists[selectedCorpId].data, searchTerm)
      );
    }
  }, [selectedCorpId, searchTerm]);

  useEffect(() => {
    if (selectedCompany) {
      setTableData(
        filterAccounts(AllAcctLists[selectedCompany].data, searchTerm)
      );
    }
  }, [selectedCompany, searchTerm]);

  return (
    <div className="">
      <CompanyDropdown options={CompanyList} onSelect={handleCompanyChange} />

      <div className="flex justify-between mb-5">
        <SearchBar searchTerm={searchTerm} onChange={handleSearch} />
        <CurrencyDropdown
          selectedCurrency={selectedCurrency}
          onChange={handleCurrencyChange}
        />
      </div>

      <div className="flex justify-end">
        <Suspense fallback={<div>Loading micro frontend...</div>}>
          <DownloadButton />
        </Suspense>
      </div>

      {selectedCompany === null ? (
        <Accordion
          companyList={CompanyList}
          corpId={selectedCorpId}
          onCorpIdChange={handleCorpIdChange}
          children={<Table data={tableData} columns={columns} />}
        />
      ) : (
        <Table data={tableData} columns={columns} />
      )}
    </div>
  );
};

export default AcctListing;
