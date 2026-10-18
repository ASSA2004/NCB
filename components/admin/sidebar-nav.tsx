"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, FolderKanban, Settings, LogOut } from "lucide-react"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
    onLogout: () => void
}

export function SidebarNav({ className, onLogout, ...props }: SidebarNavProps) {
    const pathname = usePathname()

    const items = [
        {
            title: "Leads",
            href: "/admin",
            icon: LayoutDashboard,
        },
        {
            title: "Projects",
            href: "/admin/projects",
            icon: FolderKanban,
        },
    ]

    return (
        <nav
            className={cn(
                "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
                className
            )}
            {...props}
        >
            {items.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                >
                    <Button
                        variant={pathname === item.href ? "secondary" : "ghost"}
                        className="w-full justify-start"
                    >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.title}
                    </Button>
                </Link>
            ))}

            <div className="lg:pt-4 lg:mt-4 lg:border-t">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={onLogout}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </nav>
    )
}
