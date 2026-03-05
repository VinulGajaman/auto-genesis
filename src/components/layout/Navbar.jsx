import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Group, Button, Text, ActionIcon, Badge, Box, Drawer, Stack, Divider,
} from '@mantine/core';
import { useDisclosure, useWindowScroll } from '@mantine/hooks';
import { Plus, Menu, X, GitCompare, Home, UserCircle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const compareList = useAppStore((s) => s.compareList);
    const user = useAuthStore((s) => s.user);
    const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);
    const [scroll] = useWindowScroll();

    const navTo = (path) => { navigate(path); closeDrawer(); };
    const isScrolled = scroll.y > 20;

    return (
        <>
            {/* ── Futuristic Floating Navbar ── */}
            <Box
                style={{
                    position: 'fixed',
                    top: isScrolled ? 12 : 16,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 1000,
                    width: '90%',
                    maxWidth: 1200,
                    height: 64,
                    background: isScrolled ? 'rgba(13, 17, 23, 0.85)' : 'rgba(13, 17, 23, 0.65)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: 999,
                    padding: '0 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: isScrolled
                        ? '0 10px 40px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(59, 130, 246, 0.15)'
                        : '0 4px 24px rgba(0, 0, 0, 0.4)',
                }}
            >
                {/* Glow behind nav */}
                <Box style={{
                    position: 'absolute', inset: -1, borderRadius: 999, zIndex: -1,
                    background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.1), transparent)',
                    opacity: isScrolled ? 1 : 0.5, transition: 'opacity 0.4s',
                }} />

                {/* ── Logo ── */}
                <Group gap={8} style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => navTo('/')}>
                    <img src="/favicon.svg" alt="AutoGenesis" style={{ height: 24, width: 'auto' }} />
                    <Text ff="var(--font-display)" fz={22} lts="0.08em" style={{ color: '#fff', lineHeight: 1 }}>
                        AUTO<span style={{ color: '#3b82f6' }}>GENESIS</span>
                    </Text>
                </Group>

                {/* ── Center Links (Desktop) ── */}
                <Group gap={24} visibleFrom="md">
                    <NavLink label="Fleet" path="/" active={location.pathname === '/'} onClick={() => navTo('/')} />
                    <NavLink
                        label="Compare"
                        path="/compare"
                        active={location.pathname === '/compare'}
                        onClick={() => navTo('/compare')}
                        badge={compareList.length > 0 ? compareList.length : null}
                    />
                </Group>

                {/* ── Right Actions ── */}
                <Group gap="sm">
                    {/* Neon Add Button (Desktop) */}
                    {user ? (
                        <>
                            <Button
                                visibleFrom="md"
                                radius="xl"
                                size="sm"
                                leftSection={<Plus size={14} strokeWidth={3} />}
                                onClick={() => navTo('/add-vehicle')}
                                style={{
                                    background: 'transparent',
                                    border: '1px solid #3b82f6',
                                    color: '#3b82f6',
                                    fontWeight: 700,
                                    boxShadow: 'inset 0 0 12px rgba(59,130,246,0.2), 0 0 12px rgba(59,130,246,0.2)',
                                    transition: 'all 0.3s ease',
                                }}
                                styles={{
                                    root: { '&:hover': { background: '#3b82f6', color: '#fff', boxShadow: '0 0 24px rgba(59,130,246,0.6)' } }
                                }}
                            >
                                Add Vehicle
                            </Button>
                            <Button
                                visibleFrom="md"
                                variant="subtle"
                                onClick={() => navTo('/profile')}
                                style={{ color: 'white', padding: '0 8px' }}
                            >
                                <Group gap={8}>
                                    <UserCircle size={20} />
                                    <Text fw={600} fz="sm">{user.name.split(' ')[0]}</Text>
                                </Group>
                            </Button>
                        </>
                    ) : (
                        <Button
                            visibleFrom="md"
                            radius="xl"
                            size="sm"
                            onClick={() => navTo('/login')}
                            style={{
                                background: '#3b82f6',
                                color: '#fff',
                                fontWeight: 700,
                                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
                            }}
                        >
                            Login / Sign Up
                        </Button>
                    )}

                    {/* Mobile Hamburger */}
                    <ActionIcon
                        hiddenFrom="md"
                        variant="subtle"
                        color="brand"
                        size="lg"
                        radius="xl"
                        onClick={openDrawer}
                        style={{ background: 'rgba(59,130,246,0.1)' }}
                    >
                        <Menu size={18} />
                    </ActionIcon>
                </Group>
            </Box>

            {/* ── Mobile Drawer ── */}
            <Drawer
                opened={drawerOpened}
                onClose={closeDrawer}
                position="right"
                size="280px"
                zIndex={2000}
                withCloseButton={false}
                styles={{
                    body: { padding: 0 },
                    content: { background: '#080c12', borderLeft: '1px solid rgba(59,130,246,0.2)' },
                    overlay: { backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.6)' },
                }}
            >
                <Group justify="space-between" p="md" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <Group gap={8}>
                        <img src="/favicon.svg" alt="AutoGenesis" style={{ height: 20 }} />
                        <Text ff="var(--font-display)" fz={18} c="white" lts="0.05em">AUTO<span style={{ color: '#3b82f6' }}>GENESIS</span></Text>
                    </Group>
                    <ActionIcon variant="subtle" color="gray" onClick={closeDrawer}><X size={18} /></ActionIcon>
                </Group>

                <Stack gap={0} p="md">
                    <DrawerNavItem icon={<Home size={16} />} label="Fleet" active={location.pathname === '/'} onClick={() => navTo('/')} />
                    <DrawerNavItem
                        icon={<GitCompare size={16} />} label="Compare"
                        active={location.pathname === '/compare'}
                        badge={compareList.length > 0 ? compareList.length : null}
                        onClick={() => navTo('/compare')}
                    />
                    <Divider my="md" color="rgba(255,255,255,0.06)" />
                    {user ? (
                        <>
                            <Button
                                leftSection={<Plus size={14} />}
                                color="brand" radius="md" fullWidth fw={700} mb="sm"
                                onClick={() => navTo('/add-vehicle')}
                                style={{ boxShadow: '0 4px 16px rgba(59,130,246,0.4)' }}
                            >
                                Add Vehicle
                            </Button>
                            <Button
                                leftSection={<UserCircle size={14} />}
                                variant="outline" color="brand" radius="md" fullWidth fw={700}
                                onClick={() => navTo('/profile')}
                            >
                                My Profile
                            </Button>
                        </>
                    ) : (
                        <Button
                            color="brand" radius="md" fullWidth fw={700}
                            onClick={() => navTo('/login')}
                            style={{ boxShadow: '0 4px 16px rgba(59,130,246,0.4)' }}
                        >
                            Login / Sign Up
                        </Button>
                    )}
                </Stack>
            </Drawer>

            {/* Spacer to push content down since navbar is fixed */}
            <Box h={isScrolled ? 50 : 80} style={{ transition: 'height 0.4s' }} />
        </>
    );
}

function NavLink({ label, active, onClick, badge }) {
    return (
        <Button
            variant="subtle"
            onClick={onClick}
            style={{
                position: 'relative',
                color: active ? '#fff' : 'rgba(255,255,255,0.6)',
                fontWeight: 600,
                fontSize: 14,
                fontFamily: 'var(--font-body)',
            }}
            styles={{
                root: {
                    '&:hover': {
                        color: '#fff',
                        background: 'rgba(255,255,255,0.05)',
                        transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.2s ease',
                }
            }}
        >
            <Group gap={8}>
                {label}
                {badge && <Badge size="xs" color="brand" variant="filled" circle>{badge}</Badge>}
            </Group>
            {active && (
                <Box style={{
                    position: 'absolute', bottom: 4, left: 16, right: 16, height: 2,
                    background: '#3b82f6', borderRadius: 2,
                    boxShadow: '0 -2px 8px rgba(59,130,246,0.8)'
                }} />
            )}
        </Button>
    );
}

function DrawerNavItem({ icon, label, badge, active, onClick }) {
    return (
        <Button
            variant={active ? 'light' : 'subtle'}
            color={active ? 'brand' : 'gray'}
            fullWidth radius="md"
            leftSection={icon}
            justify="flex-start"
            style={{ fontWeight: 600, fontSize: 15, paddingLeft: 12, marginBottom: 4 }}
            onClick={onClick}
        >
            <Group justify="space-between" w="100%">
                <span>{label}</span>
                {badge && <Badge size="sm" color="brand" variant="filled" circle>{badge}</Badge>}
            </Group>
        </Button>
    );
}
