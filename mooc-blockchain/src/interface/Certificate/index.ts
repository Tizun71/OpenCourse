interface CertificateNFT {
    name: string;
    description: string;
    image: string;
    attribute: {
      trait_type: string;
      value: string;
    }[];
  }

interface CertificateMint {
  fullName: string;
  email: string;
  walletAddress: string;
  userId: number;
  courseId: number
}

export type {CertificateNFT, CertificateMint}