import UnifiedVisualizer from "@/components/UnifiedVisualizer";

const CartesianCylindricalSphericalPage = () => {
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col border-t border-slate-300">
            <div className="text-xl sm:text-2xl lg:text-3xl font-black uppercase text-center py-8">
                Cartesian, Cylindrical and Spherical Demo
            </div>

            <div className="pb-10">
                <div className="text-xl font-black uppercase text-center py-6">
                    INTERACTIVE DEMO
                </div>
                <div className="flex justify-center overflow-x-auto">
                    <div className="min-w-[320px] max-w-[90vw] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px]">
                        <UnifiedVisualizer />
                    </div>
                </div>
            </div>      
        </div>
    );
};

export default CartesianCylindricalSphericalPage;