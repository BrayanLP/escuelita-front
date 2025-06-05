'use client';
import { Badge } from "@/components/ui/badge";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface Props {
    category: string;
}

export function SearchCommunitiesByCategory({category}: Props) {
     const searchParams = useSearchParams();
     const router = useRouter();
     const pathname = usePathname();

    const selectedCategory = searchParams.get("category") || "Todos";

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(window.location.search);
            params.set(name, value);

            return params.toString();
        }, [searchParams]);


    const handleCategoryClick = (category: string) => {
        const queryString = createQueryString("category", category);
        router.push(pathname + "?" + queryString);
    }


    return (
        <Badge
            onClick={() => handleCategoryClick(category)}
            variant={selectedCategory === category ? "default" : "outline"}
            className="cursor-pointer"
        >
            {category}
        </Badge>
    )

}
