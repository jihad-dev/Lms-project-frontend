import React from "react";
type ExpandableDescriptionProps = {
    description: string;
};
export const ExpandableDescription: React.FC<ExpandableDescriptionProps> = ({ description }) => {
    const [expanded, setExpanded] = React.useState(false);
    const limit = 120;
    const isLong = description.length > limit;
    const text = expanded || !isLong ? description : description.slice(0, limit) + "...";
    return (
        <p className="text-muted-foreground text-sm mb-3">
            {text}
            {isLong && (
                <button
                    type="button"
                    onClick={() => setExpanded((v) => !v)}
                    className="ml-2 text-primary underline cursor-pointer"
                >
                    {expanded ? "Show less" : "Show more"}
                </button>
            )}
        </p>
    );
};
