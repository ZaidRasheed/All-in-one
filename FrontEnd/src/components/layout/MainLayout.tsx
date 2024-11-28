import React from 'react'
import SideBar from './SideBar'

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ display: "flex", maxHeight: '100vh' }}>
            <SideBar />
            {children}
        </div>

    )
}
