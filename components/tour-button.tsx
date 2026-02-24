"use client"

import { Button } from "@/components/ui/button"
import { IconDeviceDesktopAnalytics } from "@tabler/icons-react"
import { driver } from "driver.js"
import "driver.js/dist/driver.css"

export function TourButton() {
    const handleStartTour = () => {
        const driverObj = driver({
            showProgress: true,
            steps: [
                {
                    popover: {
                        title: 'Welcome to Theiapollo!',
                        description: 'Let us take a quick tour of your new Inventory System dashboard.',
                        side: "bottom",
                        align: 'start'
                    }
                },
                {
                    element: '#sidebar-nav',
                    popover: {
                        title: 'Navigation Menu',
                        description: 'Access all your modules here, including Products, Orders, and System Logs.',
                        side: "right",
                        align: 'start'
                    }
                },
                {
                    element: '#notifications-bell',
                    popover: {
                        title: 'Real-time Notifications',
                        description: 'Stay updated when stock is low, new orders arrive, or invoices are paid.',
                        side: "bottom",
                        align: 'center'
                    }
                },
                {
                    element: '#theme-toggle',
                    popover: {
                        title: 'Slack Colorful Theme',
                        description: 'Toggle between Light and Dark mode. The UI is designed with a sleek Slack-inspired palette!',
                        side: "bottom",
                        align: 'center'
                    }
                },
                {
                    element: '#user-menu',
                    popover: {
                        title: 'Account & Settings',
                        description: 'Manage your profile and configure Two-Factor Authentication (2FA) here.',
                        side: "bottom",
                        align: 'end'
                    }
                },
                {
                    popover: {
                        title: 'You are all set!',
                        description: 'Feel free to explore the system.',
                    }
                }
            ]
        });

        driverObj.drive();
    }

    return (
        <Button variant="outline" size="sm" onClick={handleStartTour} className="hidden sm:flex gap-2 text-primary border-primary hover:bg-primary/10">
            <IconDeviceDesktopAnalytics className="h-4 w-4" />
            <span>Tour</span>
        </Button>
    )
}
