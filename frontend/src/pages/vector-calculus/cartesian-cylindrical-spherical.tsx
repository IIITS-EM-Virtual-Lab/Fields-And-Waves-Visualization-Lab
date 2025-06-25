import UnifiedVisualizer from "@/components/UnifiedVisualizer";

const CartesianCylindricalSphericalPage = () => {
    return (
        <div className="px-48 flex flex-col border-t border-slate-300">
            <div className="text-xl font-black uppercase text-center py-10">
                Cartesian, Cylindrical and Spherical Demo
            </div>

            <div className="pb-10">
                <div className="text-xl font-black uppercase text-center py-10">
                    INTERACTIVE DEMO
                </div>
                <div className="flex justify-center">
                    <UnifiedVisualizer />
                </div>
            </div>      
        </div>
  );
};

export default CartesianCylindricalSphericalPage;