import UserController from '@/actions/App/Http/Controllers/UserController';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import Heading from '@/components/heading';
import { index, create } from '@/routes/users';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoaderCircle } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: index.url(),
    },
    {
        title: 'Create User',
        href: create.url(),
    },
];

export default function Create() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create User" />
            <div className="flex h-full flex-1 flex-col overflow-x-auto rounded-xl p-4">
                <Heading
                    title="Create User"
                    description="Fill out the form below to add a new user to the system."
                />
                <div className="max-w-2xl">
                    <Form
                        {...UserController.store.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        className="space-y-6"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid grid-cols-4 gap-4">
                                    <Label htmlFor="name" className="col-span-1 flex items-center">Name</Label>
                                    <div className="col-span-3 gap-2">
                                        <Input
                                            id="name"
                                            type="text"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="name"
                                            name="name"
                                            placeholder="Full name"
                                        />
                                        <InputError message={errors.name} className="ms-2.5" />
                                    </div>
                                    <Label htmlFor="username" className="col-span-1 flex items-center">Username</Label>
                                    <div className="col-span-3 gap-2">
                                        <Input
                                            id="username"
                                            type="text"
                                            required
                                            tabIndex={2}
                                            autoComplete="username"
                                            name="username"
                                            placeholder="Username"
                                        />
                                        <InputError message={errors.username} className="ms-2.5" />
                                    </div>
                                    <Label htmlFor="email" className="col-span-1 flex items-center">Email address</Label>
                                    <div className="col-span-3 gap-2">
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            tabIndex={3}
                                            autoComplete="email"
                                            name="email"
                                            placeholder="email@example.com"
                                        />
                                        <InputError message={errors.email} className="ms-2.5" />
                                    </div>
                                    <Label htmlFor="role" className="col-span-1 flex items-center">Role</Label>
                                    <div className="col-span-3 gap-2">
                                        <Select name="role" required>
                                            <SelectTrigger className="w-full" id="role" tabIndex={4}>
                                                <SelectValue placeholder="Role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="cashier">Cashier</SelectItem>
                                                <SelectItem value="chef">Chef</SelectItem>
                                                <SelectItem value="waiter">Waiter</SelectItem>
                                                <SelectItem value="manager">Manager</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.role} className="ms-2.5" />
                                    </div>
                                    <Label htmlFor="password" className="col-span-1 flex items-center">Password</Label>
                                    <div className="col-span-3 gap-2">
                                        <Input
                                            id="password"
                                            type="password"
                                            required
                                            tabIndex={5}
                                            autoComplete="new-password"
                                            name="password"
                                            placeholder="Password"
                                        />
                                        <InputError message={errors.password} className="ms-2.5" />
                                    </div>

                                    <Label htmlFor="password_confirmation" className="col-span-1 flex items-center">
                                        Confirm password
                                    </Label>
                                    <div className="col-span-3 gap-2">
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            required
                                            tabIndex={6}
                                            autoComplete="new-password"
                                            name="password_confirmation"
                                            placeholder="Confirm password"
                                        />
                                        <InputError
                                            message={errors.password_confirmation}
                                            className="ms-2.5"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        asChild
                                    >
                                        <Link href={index.url()}>&laquo; Back</Link>
                                    </Button>
                                    <Button
                                        type="submit"
                                        tabIndex={7}
                                        disabled={processing}
                                        data-test="submit-button"
                                        className="cursor-pointer"
                                    >
                                        {processing && (
                                            <LoaderCircle className="h-4 w-4 animate-spin" />
                                        )}
                                        Submit
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </div>
        </AppLayout>
    );
}
