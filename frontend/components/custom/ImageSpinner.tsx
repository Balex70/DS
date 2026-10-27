import { LoaderCircle } from "lucide-react";

export function ImageSpinner() {
    return (
        <>
            {/* <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                <LoaderCircle
                    className="h-12 w-12 animate-spin text-muted-foreground/50"
                    strokeWidth={3}
                />
            </div> */}
            <div className="absolute inset-0 animate-[pulse_2s_ease-in-out_infinite] bg-slate-400/40" />
        </>
    );
}
