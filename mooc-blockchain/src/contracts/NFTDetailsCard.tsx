import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CertificateNFT } from "@/interface/Certificate";
import Image from "next/image";

interface NFTDetailsPageProps {
  certificate: CertificateNFT;
}

const NFTDetailsPage: React.FC<NFTDetailsPageProps> = ({ certificate }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="col-span-1 bg-white text-gray-900 p-6 shadow-lg border border-gray-200 rounded-xl">
        <div className="mb-6">
          <Label className="text-lg font-semibold">Tên chứng chỉ</Label>
          <p className="text-lg">{certificate.name}</p>
        </div>
        <div className="mb-6">
          <Label className="text-lg font-semibold">Mô tả</Label>
          <p className="text-lg">{certificate.description}</p>
        </div>
        <Accordion
          type="single"
          collapsible
          className="mb-6"
          defaultValue="traits"
        >
          <AccordionItem value="traits">
            <AccordionTrigger className="text-lg font-semibold">
              Thông tin chứng chỉ
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {certificate.attribute.map((attr, index) => (
                  <Card
                    key={index}
                    className="bg-gray-50 border border-gray-200 shadow-sm"
                  >
                    <CardHeader>
                      <CardTitle className="text-sm uppercase text-gray-500">
                        {attr.trait_type}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg">{attr.value}</p>
                      <p className="text-sm text-gray-500">Floor: --</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>

      <Card className="col-span-1">
        <CardContent>
          <Image
            src={certificate.image}
            alt=""
            width={500}
            height={500}
          ></Image>
        </CardContent>
      </Card>
    </div>
  );
};

export default NFTDetailsPage;
