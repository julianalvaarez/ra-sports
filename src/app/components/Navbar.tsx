'use client';
import Link from 'next/link';
import Image from 'next/image';
import { SheetContent, Sheet, SheetHeader, SheetTitle, SheetTrigger, } from "@/components/ui/sheet"
import { IoMenu } from "react-icons/io5";
import { FaInstagram } from "react-icons/fa";
import { GoMail } from "react-icons/go";
import { usePathname } from 'next/navigation';


export const Navbar = () => {
    const pathname = usePathname();
    const isLightPage = pathname === '/profesionales' || pathname === '/juveniles' || pathname?.startsWith('/jugadores/');
    const isHome = pathname === '/';

    const headerStyles = isHome
        ? 'absolute top-0 bg-transparent md:mt-5 text-white'
        : isLightPage
            ? 'bg-transparent text-black border-b border-gray-100'
            : 'bg-[#0d1e30] text-white';

    const logoSrc = isLightPage ? '/azul.png' : '/blanco.png';

    return (
        <header className={`w-full flex items-center justify-between md:justify-around py-4 px-8 ${headerStyles}`}>
            <div>
                <Link href="/" className="font-bold text-lg">
                    <Image src={logoSrc} alt="RA.Sports Logo" width={70} height={70} />
                </Link>
            </div>
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger render={<IoMenu size={25} className={isLightPage ? 'text-black' : 'text-white'} />} />
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle></SheetTitle>
                        </SheetHeader>
                        <div className='flex flex-col items-center gap-14 mt-6'>
                            <Link href="/">
                                <Image src={"/azul.png"} alt="RA.Sports Logo" width={100} height={100} />
                            </Link>
                            <ul className='font-semibold flex flex-col gap-10 text-center text-xl'>
                                <li className='hover:underline '><Link href="/profesionales">Profesionales</Link></li>
                                <li className='hover:underline '><Link href="/juveniles">Juveniles</Link></li>
                                <div className='flex justify-center items-center gap-5 text-lg'>
                                    <li><a href="https://www.instagram.com/rodriealvarez/" target="_blank" rel="noopener noreferrer" className='focus:scale-95 transition-transform'><FaInstagram size={25} /></a></li>
                                    <li><a href="mailto:ro-1312@hotmail.com" target="_blank" rel="noopener noreferrer" className='focus:scale-95 transition-transform'><GoMail size={25} /></a></li>
                                </div>
                            </ul>
                        </div>

                    </SheetContent>
                </Sheet>
            </div>
            <nav className="hidden md:flex gap-8 font-semibold text-lg">
                <ul className='flex gap-8 items-center'>
                    <li className='hover:underline '><Link href="/profesionales">Profesionales</Link></li>
                    <li className='hover:underline '><Link href="/juveniles">Juveniles</Link></li>
                    <li><a href="https://www.instagram.com/rodriealvarez/" target="_blank" rel="noopener noreferrer" className={`focus:scale-95 transition-all ${isLightPage ? 'hover:text-gray-600' : 'hover:text-gray-300'}`}><FaInstagram size={25} /></a></li>
                    <li><a href="mailto:ro-1312@hotmail.com" target="_blank" rel="noopener noreferrer" className={`focus:scale-95 transition-all ${isLightPage ? 'hover:text-gray-600' : 'hover:text-gray-300'}`}><GoMail size={25} /></a></li>
                </ul>

            </nav>
        </header>
    );
}