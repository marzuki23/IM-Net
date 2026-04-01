import { Logo } from '@/components/logo'
import Link from 'next/link'

const links = [
  {
    title: "Layanan",
    href: "/#features",
  },
  {
    title: "Paket",
    href: "/#paket",
  },
  {
    title: "Jangkauan",
    href: "/#coverage",
  },
  {
    title: "FAQ",
    href: "/#faq",
  },
];

export default function FooterSection() {
    return (
        <footer className="bg-[#FAF8F5] dark:bg-slate-950 pt-20 pb-10 border-t border-stone-200 dark:border-slate-800">
            <div className="mx-auto max-w-7xl px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
                    {/* Brand & Socials */}
                    <div className="md:col-span-1">
                        <Link
                            href="/"
                            aria-label="go home"
                            className="block w-fit mb-6">
                            <Logo />
                        </Link>
                        
                        <p className="text-sm font-bold text-[#2a2a2a] dark:text-white mb-4">Follow us on</p>
                        <div className="flex flex-wrap gap-4 text-sm">
                            <Link href="#" aria-label="X/Twitter" className="w-8 h-8 rounded-full bg-[#2a2a2a] text-white flex items-center justify-center hover:bg-orange-500 transition-colors">
                                <svg className="size-4" viewBox="0 0 24 24"><path fill="currentColor" d="M10.488 14.651L15.25 21h7l-7.858-10.478L20.93 3h-2.65l-5.117 5.886L8.75 3h-7l7.51 10.015L2.32 21h2.65zM16.25 19L5.75 5h2l10.5 14z"></path></svg>
                            </Link>
                            <Link href="#" aria-label="LinkedIn" className="w-8 h-8 rounded-full bg-[#2a2a2a] text-white flex items-center justify-center hover:bg-orange-500 transition-colors">
                                <svg className="size-4" viewBox="0 0 24 24"><path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z"></path></svg>
                            </Link>
                            <Link href="#" aria-label="Facebook" className="w-8 h-8 rounded-full bg-[#2a2a2a] text-white flex items-center justify-center hover:bg-orange-500 transition-colors">
                                <svg className="size-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95"></path></svg>
                            </Link>
                            <Link href="#" aria-label="Instagram" className="w-8 h-8 rounded-full bg-[#2a2a2a] text-white flex items-center justify-center hover:bg-orange-500 transition-colors">
                                <svg className="size-4" viewBox="0 0 24 24"><path fill="currentColor" d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"></path></svg>
                            </Link>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="md:col-span-1">
                        <h4 className="font-bold text-[#2a2a2a] dark:text-white mb-6">Hubungi Kami</h4>
                        <ul className="space-y-4 text-sm text-stone-600 dark:text-slate-400">
                            <li><span className="font-medium">Email:</span> <a href="mailto:imamabaziz@gmail.com" className="hover:text-orange-500 transition-colors">imamabaziz@gmail.com</a></li>
                            <li><span className="font-medium">No HP:</span> <a href="tel:0816688467" className="hover:text-orange-500 transition-colors">0816688467</a></li>
                            <li><span className="font-medium block mb-1">Alamat:</span> Jl. Beji Ds adiwerna Kec adiwerna kab. Tegal</li>
                        </ul>
                    </div>

                    {/* Navigation Links */}
                    <div className="md:col-span-1">
                        <h4 className="font-bold text-[#2a2a2a] dark:text-white mb-6">Navigasi</h4>
                        <ul className="space-y-3 text-sm text-stone-600 dark:text-slate-400">
                            {links.map((link, index) => (
                                <li key={index}>
                                    <Link href={link.href} className="hover:text-orange-500 transition-colors">
                                        {link.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div className="md:col-span-1">
                        <h4 className="font-bold text-[#2a2a2a] dark:text-white mb-6">Bantuan</h4>
                        <ul className="space-y-3 text-sm text-stone-600 dark:text-slate-400">
                            <li><Link href="#" className="hover:text-orange-500 transition-colors">Syarat & Ketentuan</Link></li>
                            <li><Link href="#" className="hover:text-orange-500 transition-colors">Kebijakan Privasi</Link></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-6 md:px-12 flex flex-col md:flex-row justify-between items-center text-xs text-stone-400">
                    <span>© {new Date().getFullYear()} IMNet. All rights reserved.</span>
                    <span className="mt-2 md:mt-0"></span>
                </div>
            </div>
        </footer>
    );
}
