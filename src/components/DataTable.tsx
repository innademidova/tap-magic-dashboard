
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PRSession, User } from "@/lib/data";

interface DataTableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessorKey: keyof T;
    cell?: (item: T) => React.ReactNode;
  }[];
}

export function DataTable<T>({ data, columns }: DataTableProps<T>) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={String(column.accessorKey)}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={String(column.accessorKey)}>
                  {column.cell
                    ? column.cell(item)
                    : (item[column.accessorKey] as React.ReactNode)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function UsersTable({ users }: { users: User[] }) {
  const columns = [
    { header: "Name", accessorKey: "name" as keyof User },
    { header: "Email", accessorKey: "email" as keyof User },
    { header: "Role", accessorKey: "role" as keyof User },
    {
      header: "Last Login",
      accessorKey: "lastLogin" as keyof User,
      cell: (user: User) => {
        const date = new Date(user.lastLogin);
        return date.toLocaleString();
      },
    },
    {
      header: "Status",
      accessorKey: "status" as keyof User,
      cell: (user: User) => (
        <Badge variant={user.status === "active" ? "default" : "secondary"}>
          {user.status}
        </Badge>
      ),
    },
  ];

  return <DataTable data={users} columns={columns} />;
}

export function SessionsTable({ sessions }: { sessions: PRSession[] }) {
  const columns = [
    { header: "Title", accessorKey: "title" as keyof PRSession },
    {
      header: "Date",
      accessorKey: "date" as keyof PRSession,
      cell: (session: PRSession) => {
        const date = new Date(session.date);
        return date.toLocaleString();
      },
    },
    { header: "Duration", accessorKey: "duration" as keyof PRSession },
    { header: "Participants", accessorKey: "participants" as keyof PRSession },
    {
      header: "Status",
      accessorKey: "status" as keyof PRSession,
      cell: (session: PRSession) => {
        const variant = 
          session.status === "completed" 
            ? "success" as const
            : session.status === "scheduled"
            ? "default" as const
            : "destructive" as const;
            
        return (
          <Badge 
            variant={variant === "success" ? "outline" : variant}
            className={variant === "success" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
          >
            {session.status}
          </Badge>
        );
      },
    },
  ];

  return <DataTable data={sessions} columns={columns} />;
}
