"use client";
import { useEffect, useState, ChangeEvent } from "react";
import { Advocate } from "@/lib/types";
import SearchInput from "./SearchInput";
import TableLoadingSkeleton from "@/components/TableLoadingSkeleton";
import { motion, AnimatePresence } from "framer-motion";
import classNames from "classnames";
import { formatPhone } from "@/lib/phoneNumber";

const TableHeader = () => (
    <thead className="sticky top-0 z-10 bg-white/80 backdrop-blur-md shadow-sm">
        <tr>
            <th className="w-[45px]"></th>
            <th className="min-w-[110px]">First Name</th>
            <th className="min-w-[110px]">Last Name</th>
            <th className="min-w-[130px]">City</th>
            <th className="min-w-[80px]">Degree</th>
            <th className="min-w-[550px]">Specialties</th>
            <th className="min-w-[110px]">Years of Experience</th>
            <th className="min-w-[140px]">Phone Number</th>
        </tr>
    </thead>
);

interface TableRowProps extends Advocate {
    rowNumber: number;
    isLastThree?: boolean;
}

const TableRow = ({
    rowNumber,
    firstName,
    lastName,
    city,
    degree,
    specialties,
    yearsOfExperience,
    phoneNumber,
    isLastThree,
}: TableRowProps) => {
    // Limit specialties display to three and show the rest in a tooltip
    const displayedSpecialties = specialties.slice(0, 3);
    const overflowSpecialties = specialties.slice(3).join(", ");

    return (
        <motion.tr
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="table-row"
        >
            <th scope="row" className="w-[45px]">{rowNumber}</th>
            <td className="min-w-[110px]">{firstName}</td>
            <td className="min-w-[110px]">{lastName}</td>
            <td className="min-w-[130px]">{city}</td>
            <td className="min-w-[80px]">{degree}</td>
            <td className="min-w-[550px] flex flex-wrap gap-1">
                {displayedSpecialties.map((specialty: string) => (
                    <span key={specialty} className="badge badge-outline badge-neutral">
                        {specialty}
                    </span>
                ))}
                {specialties.length > 3 && (
                    <span
                        className={classNames(
                            "badge badge-outline tooltip badge-neutral",
                            isLastThree ? "tooltip-top" : "tooltip-bottom",
                        )}
                        data-tip={overflowSpecialties}
                        aria-label={`Additional specialties: ${overflowSpecialties}`}
                    >
                        +{specialties.length - 3} more
                    </span>
                )}
            </td>
            <td className="min-w-[110px]">{yearsOfExperience}</td>
            <td className="min-w-[140px]">{formatPhone(phoneNumber)}</td>
        </motion.tr>
    );
}

const MainPage = () => {
    const [advocates, setAdvocates] = useState<Advocate[]>([]);
    const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
    const [search, setSearch] = useState("");
    const [initialLoad, setInitialLoad] = useState(true);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);

    const handleResetClick = () => setSearch('');

    useEffect(() => {
        fetch("/api/advocates")
            .then((response) => response.json())
            .then((jsonResponse) => {
                setAdvocates(jsonResponse.data);
                setFilteredAdvocates(jsonResponse.data);
            })
            .catch((error) => console.error(error))
            .finally(() => setInitialLoad(false));
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!search) {
                setFilteredAdvocates(advocates);
            } else {
                const lowerSearch = search.toLowerCase();
                setFilteredAdvocates(
                    advocates.filter((advocate) =>
                        advocate.firstName.toLowerCase().includes(lowerSearch) ||
                        advocate.lastName.toLowerCase().includes(lowerSearch) ||
                        advocate.city.toLowerCase().includes(lowerSearch) ||
                        advocate.degree.toLowerCase().includes(lowerSearch) ||
                        advocate.specialties.some((specialty) =>
                            specialty.toLowerCase().includes(lowerSearch)
                        ) ||
                        String(advocate.yearsOfExperience).includes(lowerSearch) ||
                        String(advocate.phoneNumber).includes(lowerSearch)
                    )
                );
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [search, advocates]);

    return (
        <main className="m-6">
            <h1 className="text-xl font-bold mb-4">
                Advocates
            </h1>
            <div className="rounded-box border bg-base-100">
                <section className="mb-4 p-4 shadow-sm">
                    <div className="flex flex-row items-center gap-4">
                        <SearchInput
                            value={search}
                            onChange={handleChange}
                            aria-label="Search advocates"
                        />
                        <button
                            className="btn btn-soft"
                            aria-label="Reset search"
                            onClick={handleResetClick}
                        >
                            Reset Search
                        </button>
                    </div>
                </section>
                <section
                    className="overflow-auto mb-4 h-[60vh]"
                    aria-label="Advocates data table"
                >
                    <table className="table w-full">
                        {initialLoad ? (
                            <tbody>
                                <TableLoadingSkeleton rowCount={12} />
                            </tbody>
                        ) : filteredAdvocates.length === 0 ? (
                            <tbody>
                            <motion.tr
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <td colSpan={8} className="text-center py-10 text-gray-500">
                                    No results found.
                                </td>
                            </motion.tr>
                            </tbody>
                        ) : (
                            <>
                                <TableHeader />
                                <motion.tbody layout>
                                    <AnimatePresence>
                                        {filteredAdvocates.map((advocate, index) => (
                                            <TableRow
                                                {...advocate}
                                                key={`${advocate.firstName}-${advocate.lastName}-${index}`}
                                                rowNumber={index + 1}
                                                isLastThree={index >= filteredAdvocates.length - 3}
                                            />
                                        ))}
                                    </AnimatePresence>
                                </motion.tbody>
                            </>
                        )}
                    </table>
                </section>
            </div>
        </main>
    );
};

export default MainPage;