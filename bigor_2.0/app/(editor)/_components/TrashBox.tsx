"use client";

import { Spinner } from "@/components/spinner";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery, useMutation } from "convex/react";
import { Search } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const TrashBox = () => {
    const router = useRouter();
    const params = useParams();
    const documents = useQuery(api.documents.getTrash);
    const restore = useMutation(api.documents.restore);
    const remove = useMutation(api.documents.remove);

    const [search, setSearch] = useState("");

    const filteredDocuments = documents?.filter((document) => {
        return document.title.toLowerCase().includes(search.toLocaleLowerCase());
    })

    const onClick = (documentId: string) => {
        router.push(`/documents/${documentId}`);
    }

    const onRestore = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        documentId: Id<"documents">
    ) => {
        event.stopPropagation();
        const promise = restore({ id: documentId });

        toast.promise(promise, {
            loading: "Восстанавливаем документ...",
            success: "Документ восстановлен!",
            error: "Не удалось восстановить документ."
        })
    }

    const onRemove = (
        documentId: Id<"documents">
    ) => {
        const promise = remove({ id: documentId });

        toast.promise(promise, {
            loading: "Удаляем документ...",
            success: "Документ удален!",
            error: "Не удалось удалить документ."
        })

        if (params.documentId === documentId) {
            router.push("documents");
        }
    }

    if (documents === undefined) {
        return (
            <div className="h-full flex items-center justify-center p-4" >
                <Spinner size="lg" />
            </div>
        )
    }

    return (
        <div className="text-sm">
            <div className="flex items-center gap-x-1 p-2">
                <Search className="h-4 w-4" />
                <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
                    placeholder="Фильтр по названию"
                />
            </div>
            <div className="mt-2 px-1 pb-1">
                <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
                    Ничего не нашлось
                </p>
            </div>
        </div>
    )
}