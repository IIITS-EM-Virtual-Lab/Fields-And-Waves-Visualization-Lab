import { Button } from "@/components/ui/button";

const TripleProductPage = () => {
  return (
    <div className="px-48 flex flex-col border-t border-slate-300">
      <div className="text-xl font-black uppercase text-center py-10">
        Scalar Triple Product
      </div>
      <div>
        Scalar triple product is the dot product of a vector with the cross
        product of two other vectors, i.e., if a, b, c are three vectors, then
        their scalar triple product is a · (b × c). It is also commonly known as
        the triple scalar product, box product, and mixed product.
      </div>
      <div>
        Given three vectors A,B and C, we define the scalar triple product as
      </div>
      <div className="flex justify-center font-bold p-8">
        A.(B × C) = B.(C×A) = C.(A×B)
      </div>
      <div>
        <div>
          obtained in cyclic permutation. If{" "}
          <span className="font-bold">A.(B × C) </span>is the volume of a
          parallelepiped having A,B, and C as edges and is easily obtained by
          finding the determinant of the 3× 3 matrix formed by A,B and C; that
          is
        </div>
        <div className="flex justify-center p-14">
          <img
            src="assets/vector-algebra/trip-1.png"
            alt="scalar-triple-product"
            className="w-[600px]"
          />
        </div>
      </div>
      <div className="py-8">
        The result of this vector multiplication is scalar.
      </div>

      <div className="text-xl font-black uppercase text-center py-10">
        VECTOR TRIPLE PRODUCT
      </div>
      <div className="pt-8">
        The cross-product of the vectors such as a × (b × c) and (a × b) × c is
        known as the vector triple product of a, b, c.
      </div>
      <div className="py-0">
        For Vectors A,B and C, we define the vector triple product as
      </div>
      <div className="py-8 flex justify-center font-bold">
        A.(B × C) = B(A.C) - C(A.B)
      </div>
      <div className="pt-8">
        Vector triple product is recognized as a vector quantity. a × (b × c) ≠
        (a × b) × c
      </div>
      <div className="">
        which may remembered as the “bac - cab” rule. It should be noted that
      </div>
      <div className="py-8 flex justify-center font-bold">(A.B)C ≠ A(B.C)</div>
      <div>But</div>
      <div className="py-8 flex justify-center font-bold">(A.B)C = C(A.B)</div>

      <div className="flex justify-end mb-48">
        <Button className="px-6">Next</Button>
      </div>
    </div>
  );
};

export default TripleProductPage;
