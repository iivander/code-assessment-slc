interface TableLoadingSkeletonProps {
    rowCount?: number;
}

const TableLoadingSkeleton = ({ rowCount = 1 }: TableLoadingSkeletonProps) => (
    <>
        {Array.from({ length: rowCount }).map((_, index) => (
            <tr key={index} className="animate-pulse" aria-hidden="true">
                <td colSpan={8}>
                    <div className="h-8 bg-gray-300 rounded w-full" />
                </td>
            </tr>
        ))}
    </>
);

export default TableLoadingSkeleton;