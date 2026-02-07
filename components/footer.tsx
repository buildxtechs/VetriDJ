import Link from "next/link"

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        &copy; {currentYear} Buildx. All rights reserved.
                    </p>
                </div>
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-6 md:px-0">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        Build by{" "}
                        <a
                            href="#"
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium underline underline-offset-4"
                        >
                            Buildx
                        </a>
                    </p>
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        Contact:{" "}
                        <a href="tel:9025407533" className="font-medium underline underline-offset-4">
                            9025407533
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    )
}
