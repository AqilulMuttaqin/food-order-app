import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, Link, router } from '@inertiajs/react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { PlusIcon, SearchIcon, Edit, Trash2 } from "lucide-react";
import { index, create } from '@/routes/users';
import { useState, FormEvent } from 'react';
import { toast } from "sonner";

type User = {
    id: number;
    name: string;
    username: string;
    email: string;
    role: string;
};

type PaginationProps = {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
};

type PageProps = {
    users: {
        data: User[];
    } & PaginationProps;
    filters: {
        search?: string;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: index.url(),
    },
];

export default function Page() {
    const { props } = usePage<PageProps>();
    const { users, filters } = props;

    const [search, setSearch] = useState(filters.search || '');
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();

        router.get(index.url(), { search }, {
            preserveState: true,
            replace: true,
        });
    };

    const clearSearch = () => {
        setSearch('');
        router.get(index.url(), {}, {
            preserveState: true,
            replace: true,
        });
    };

    const goToPage = (page: number) => {
        router.get(index.url(), {
            search: filters.search,
            page
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleDelete = (userId: number, userName: string) => {
        setDeletingId(userId);

        // Route kasar - hardcoded URL
        router.delete(`/users/${userId}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`User "${userName}" has been deleted successfully.`);
                setDeletingId(null);
            },
            onError: () => {
                toast.error("Something went wrong while deleting user.");
                setDeletingId(null);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="flex h-full flex-1 flex-col overflow-x-auto rounded-xl p-4">
                <Heading
                    title="Users Data"
                    description="Manage your users information"
                />
                <div className="flex items-center justify-between mb-4">
                    <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center gap-2">
                        <div className="relative flex-1">
                            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search by name"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 pr-10"
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                        <Button type="submit" variant="outline" className="cursor-pointer">
                            Search
                        </Button>
                    </form>
                    <Button variant="outline" asChild>
                        <Link href={create.url()}>
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Add User
                        </Link>
                    </Button>
                </div>

                <div className="rounded-lg border overflow-hidden mb-4">
                    <Table>
                        <TableHeader className="bg-neutral-100 dark:bg-neutral-800">
                            <TableRow>
                                <TableHead className="w-16 text-center">No</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Username</TableHead>
                                <TableHead className="text-center">Role</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead className="w-40 text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.data.length > 0 ? (
                                users.data.map((user, index) => (
                                    <TableRow key={user.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900">
                                        <TableCell className="text-center">{(users.current_page - 1) * users.per_page + index + 1}</TableCell>
                                        <TableCell className="font-medium">{user.name}</TableCell>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="outline">{user.role}</Badge>
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex justify-center space-x-2">

                                                {/* Delete Button dengan Dialog */}
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            disabled={deletingId === user.id}
                                                            className="cursor-pointer"
                                                        >
                                                            {deletingId === user.id ? (
                                                                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                                                            ) : (
                                                                <Trash2 className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </DialogTrigger>

                                                    <DialogContent>
                                                        <DialogTitle>
                                                            Delete User
                                                        </DialogTitle>
                                                        <DialogDescription>
                                                            Are you sure you want to delete user <strong>{user.name}</strong>?
                                                            This action cannot be undone.
                                                        </DialogDescription>

                                                        <DialogFooter className="gap-2">
                                                            <DialogClose asChild>
                                                                <Button
                                                                    variant="secondary"
                                                                    disabled={deletingId === user.id}
                                                                    className="cursor-pointer"
                                                                >
                                                                    Cancel
                                                                </Button>
                                                            </DialogClose>

                                                            <Button
                                                                variant="destructive"
                                                                disabled={deletingId === user.id}
                                                                onClick={() => handleDelete(user.id, user.name)}
                                                                className="cursor-pointer"
                                                            >
                                                                {deletingId === user.id ? (
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                                                                        Deleting...
                                                                    </div>
                                                                ) : (
                                                                    'Delete User'
                                                                )}
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-neutral-500 py-8">
                                        {filters.search ? `No users found for "${filters.search}"` : 'No users found'}
                                        {filters.search && (
                                            <Button
                                                variant="link"
                                                onClick={clearSearch}
                                                className="ml-2"
                                            >
                                                Clear search
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {users.data.length > 0 && (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            Showing {users.from} to {users.to} of {users.total} results
                        </div>

                        <div className="flex items-center space-x-1">
                            {/* First Page Button */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => goToPage(1)}
                                disabled={users.current_page === 1}
                                title="Go to first page"
                                className="cursor-pointer"
                            >
                                &laquo;
                            </Button>

                            {/* Previous Page Button */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => goToPage(users.current_page - 1)}
                                disabled={users.current_page === 1}
                                title="Previous page"
                                className="cursor-pointer"
                            >
                                &lsaquo;
                            </Button>

                            {/* Page Numbers */}
                            {(() => {
                                const totalPages = users.last_page;
                                const currentPage = users.current_page;
                                const pagesToShow = 5;

                                let startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
                                let endPage = Math.min(totalPages, startPage + pagesToShow - 1);

                                if (endPage - startPage + 1 < pagesToShow) {
                                    startPage = Math.max(1, endPage - pagesToShow + 1);
                                }

                                const pages = [];
                                for (let i = startPage; i <= endPage; i++) {
                                    pages.push(i);
                                }

                                return pages.map(page => (
                                    <Button
                                        key={page}
                                        variant={page === currentPage ? "default" : "outline"}
                                        size="sm"
                                        onClick={page === currentPage ? undefined : () => goToPage(page)}
                                        disabled={page === currentPage}
                                        className={`min-w-[40px] ${page === currentPage
                                                ? "bg-blue-600 text-white cursor-default"
                                                : "cursor-pointer"
                                            }`}
                                    >
                                        {page}
                                    </Button>
                                ));
                            })()}

                            {/* Next Page Button */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => goToPage(users.current_page + 1)}
                                disabled={users.current_page === users.last_page}
                                title="Next page"
                                className="cursor-pointer"
                            >
                                &rsaquo;
                            </Button>

                            {/* Last Page Button */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => goToPage(users.last_page)}
                                disabled={users.current_page === users.last_page}
                                title="Go to last page"
                                className="cursor-pointer"
                            >
                                &raquo;
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}