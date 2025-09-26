import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();

    const groupedItems = items.reduce((acc, item) => {
        const group = item.group || 'Other';
        if (!acc[group]) {
            acc[group] = [];
        }
        acc[group].push(item);
        return acc;
    }, {} as Record<string, NavItem[]>);
    
    const groupOrder = ['Home', 'Pages'];

    return (
        <>
            {groupOrder.map((groupName) => {
                const groupItems = groupedItems[groupName];
                if (!groupItems || groupItems.length === 0) return null;
                
                return (
                    <SidebarGroup key={groupName} className="px-2 py-0">
                        <SidebarGroupLabel>{groupName}</SidebarGroupLabel>
                        <SidebarMenu>
                            {groupItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={page.url.startsWith(
                                            typeof item.href === 'string'
                                                ? item.href
                                                : item.href.url,
                                        )}
                                        tooltip={{ children: item.title }}
                                    >
                                        <Link href={item.href} prefetch>
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                );
            })}
        </>
    );
}
