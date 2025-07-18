import { Button } from "@/components/ui/button";
import VectorTripleProduct from "@/components/VectorTripleProduct";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../../store/slices/authSlice';

const TripleProductPage = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col border-t border-slate-300">
      <div className="pb-10">
        <div className="text-xl font-black uppercase text-center py-6">
          INTERACTIVE DEMO
        </div>
        <div className="flex justify-center overflow-x-auto">
          <div className="min-w-[320px] max-w-[90vw] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px]">
            <VectorTripleProduct />
          </div>
        </div>
      </div>
      
      <div className="text-xl sm:text-2xl lg:text-3xl font-black uppercase text-center py-8">
        Scalar Triple Product
      </div>
      
      <div className="space-y-4">
        <div>
          Scalar triple product is the dot product of a vector with the cross
          product of two other vectors, i.e., if a, b, c are three vectors, then
          their scalar triple product is a · (b × c). It is also commonly known as
          the triple scalar product, box product, and mixed product.
        </div>
        
        <div>
          Given three vectors A,B and C, we define the scalar triple product as
        </div>
        
        <div className="flex justify-center font-bold p-4 sm:p-8">
          <div className="text-center break-words">
            A.(B × C) = B.(C×A) = C.(A×B)
          </div>
        </div>
        
        <div>
          <div>
            obtained in cyclic permutation. If{" "}
            <span className="font-bold">A.(B × C) </span>is the volume of a
            parallelepiped having A,B, and C as edges and is easily obtained by
            finding the determinant of the 3× 3 matrix formed by A,B and C; that
            is
          </div>
          
          <div className="flex justify-center p-8 sm:p-14">
            <img
              src="assets/vector-algebra/trip-1.png"
              alt="scalar-triple-product"
              className="max-w-full h-auto w-auto max-w-[600px]"
            />
          </div>
        </div>
        
        <div className="py-4 sm:py-8">
          The result of this vector multiplication is scalar.
        </div>
      </div>

      <div className="text-xl sm:text-2xl lg:text-3xl font-black uppercase text-center py-8">
        VECTOR TRIPLE PRODUCT
      </div>
      
      <div className="space-y-4">
        <div>
          The cross-product of the vectors such as a × (b × c) and (a × b) × c is
          known as the vector triple product of a, b, c.
        </div>
        
        <div>
          For Vectors A,B and C, we define the vector triple product as
        </div>
        
        <div className="py-4 sm:py-8 flex justify-center font-bold">
          <div className="text-center break-words">
            A.(B × C) = B(A.C) - C(A.B)
          </div>
        </div>
        
        <div>
          Vector triple product is recognized as a vector quantity. a × (b × c) ≠
          (a × b) × c
        </div>
        
        <div>
          which may remembered as the "bac - cab" rule. It should be noted that
        </div>
        
        <div className="py-4 sm:py-8 flex justify-center font-bold">
          <div className="text-center break-words">
            (A.B)C ≠ A(B.C)
          </div>
        </div>
        
        <div>But</div>
        
        <div className="py-4 sm:py-8 flex justify-center font-bold">
          <div className="text-center break-words">
            (A.B)C = C(A.B)
          </div>
        </div>
      </div>

      {isAuthenticated ? (
        <div className="flex justify-center mt-6">
          <Button onClick={() => navigate('/quiz/vector-algebra/triple-product')}>
            Take Test
          </Button>
        </div>
      ) : (
        <div className="text-center text-sm sm:text-base text-[#a00032] mt-6">
          Please log in to take the test.
        </div>
      )}
    </div>
  );
};

export default TripleProductPage;