import Header from "@/components/Header/Header";

export default function HeaderDemo() {
    return (
        <div className="min-h-screen bg-[var(--parchment)]">
            <Header />
            <div className="p-12 text-center text-[var(--ink)]">
                <h1 className="text-4xl font-serif mb-4">Header Implementation Demo</h1>
                <p className="max-w-2xl mx-auto">
                    The header above is constructed using SVGs for the ornaments and tailored CSS for the borders and gradients.
                    It uses the specified Gold and Bronze design tokens.
                </p>
            </div>
        </div>
    );
}
