export default function NavigationGroup({label, children} : {label?: string, children: React.ReactNode}){
    return(
        <div className="w-full">
            {label && <p className="eyebrow mb-2">{label}</p>}
            
            <div className="flex flex-col gap-0.5">
                {children}
            </div>
        </div>
    )
}