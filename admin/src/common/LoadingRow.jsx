import { TableRow, TableCell } from '../mui/MuiTable';
import MuiSkeleton from '../mui/MuiSkeleton';

/**
 * LoadingRow — skeleton placeholder for a table row.
 * @param {{ columns?: number }} props
 */
export default function LoadingRow({ columns = 7 }) {
  return (
    <TableRow>
      {Array.from({ length: columns }).map((_, i) => (
        <TableCell key={i}>
          <MuiSkeleton
            variant="text"
            width={i === 0 ? 80 : i === 1 ? '70%' : 60}
            height={20}
            animation="wave"
          />
        </TableCell>
      ))}
    </TableRow>
  );
}
