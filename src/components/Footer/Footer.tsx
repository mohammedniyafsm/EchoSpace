import { bricolage_grotesque } from "@/lib/fonts";
import Link from "next/link";
import { RiGithubFill, RiTwitterFill } from "react-icons/ri";

export default function Footer() {
    return (
        <footer className={`${bricolage_grotesque} bg-black p-5 pt-28`}>
            <section className="flex justify-between items-center max-sm:flex-col max-sm:gap-1">
                <div>
                    <Link href="/" className={`text-lg max-sm:text-lg font-bold flex items-center`}>

                        <span className='ml-[-3px]'>
                            EchoSpace
                        </span>
                    </Link>
                </div>
                <div className="md:text-sm text-xs space-x-1">
                    <span>
                        Designed and Developed by
                    </span>
                    <Link href={''} target="_blank" className="underline text-orange-500 dark:text-orange-300">
                        Niyaf
                    </Link>
                </div>
                <div className="flex gap-2">
                    <Link href={'https://github.com/mohammedniyafsm/'} target="_blank">
                        <RiGithubFill className="h-5 w-5 hover:fill-orange-500 dark:hover:fill-orange-300" />
                    </Link>
                    <Link href={'https://x.com/'} target="_blank">
                        <RiTwitterFill className="h-5 w-5 hover:fill-orange-500 dark:hover:fill-orange-300" />
                    </Link>
                </div>
            </section>
        </footer>
    )
}