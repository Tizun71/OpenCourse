package vn.tizun.service.implement;

import org.springframework.beans.factory.annotation.Value;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Utf8String;
import org.web3j.abi.datatypes.generated.Bytes32;
import org.web3j.abi.datatypes.generated.Uint8;
import org.web3j.crypto.RawTransaction;
import org.web3j.crypto.TransactionEncoder;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.response.EthGetTransactionCount;
import org.web3j.protocol.http.HttpService;
import org.web3j.crypto.Credentials;
import org.web3j.tx.RawTransactionManager;
import org.web3j.tx.gas.ContractGasProvider;
import org.web3j.tx.gas.StaticGasProvider;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.datatypes.Function;
import org.web3j.protocol.core.methods.request.Transaction;
import org.web3j.protocol.core.methods.response.EthSendTransaction;


import org.springframework.stereotype.Service;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.methods.request.Transaction;
import org.web3j.protocol.core.methods.response.EthSendTransaction;
import org.web3j.protocol.http.HttpService;
import org.web3j.utils.Numeric;

import java.io.IOException;
import java.math.BigInteger;
import java.util.Arrays;
import java.util.Collections;

@Service
public class EthereumService {

    @Value("${eth.walletPrivateKey}")
    private String walletPrivateKey;

    @Value("${eth.sepoliaNode}")
    private String sepoliaNode;

    public String callMintFromBlockchain(String toAddress, String metadataURI, String certificateContent) throws IOException {
        String privateKey = walletPrivateKey;
        String contractAddress = "0xc8De4Aa71cF5767f0D7D5a649b58B2BeA9afC370";

        Web3j web3j = Web3j.build(new HttpService(sepoliaNode));
        Credentials credentials = Credentials.create(privateKey);

        EthGetTransactionCount ethGetTransactionCount = web3j.ethGetTransactionCount(
                credentials.getAddress(), DefaultBlockParameterName.LATEST).send();
        BigInteger nonce = ethGetTransactionCount.getTransactionCount();
        byte[] hashBytes = Numeric.hexStringToByteArray(certificateContent);
        System.out.println(hashBytes);
        Bytes32 certHash = new Bytes32(hashBytes);
        Function function = new Function(
                "safeMint",
                Arrays.asList(new Address(toAddress), new Utf8String(metadataURI), certHash),
                Collections.singletonList(new TypeReference<Uint256>() {})
        );
        String encodedFunction = FunctionEncoder.encode(function);

        BigInteger gasLimit = BigInteger.valueOf(300_000);
        BigInteger gasPrice = BigInteger.valueOf(20_000_000_000L);
        RawTransaction rawTransaction = RawTransaction.createTransaction(
                nonce,
                gasPrice,
                gasLimit,
                contractAddress,
                BigInteger.ZERO,
                encodedFunction
        );

        byte[] signedMessage = TransactionEncoder.signMessage(rawTransaction, 11155111L, credentials);
        String hexValue = Numeric.toHexString(signedMessage);

        EthSendTransaction sendTransaction = web3j.ethSendRawTransaction(hexValue).send();

        if (sendTransaction.hasError()) {
            System.err.println("Error: " + sendTransaction.getError().getMessage());
            return "";
        } else {
            System.out.println("Mint thành công TxHash: " + sendTransaction.getTransactionHash());
            return sendTransaction.getTransactionHash();
        }
    }
}
