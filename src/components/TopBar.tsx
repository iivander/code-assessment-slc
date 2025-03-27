import Link from "next/link";

const TopBar = () => (
    <header
        role="banner"
        className="sticky top-0 z-50 shadow-md transition-colors duration-300 bg-white"
    >
        <nav className="h-16 flex justify-between items-center px-6" aria-label="Main Navigation">
            <Link href="/" className="text-2xl font-bold text-gray-800">
                Solace
            </Link>
        </nav>
    </header>
);

export default TopBar;