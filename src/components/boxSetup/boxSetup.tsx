import { useState, useEffect } from "react";
import "./style.css";
import CheckIcon from "@mui/icons-material/Check";
import axios from "axios";

interface InfConf {
  setupInf: {};
  setSetupInf: any;
}
interface Costumer {
  name: string;
}
export default function BoxSetup(props: InfConf) {
  const [infs, setInfs] = useState<Costumer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");

  // Mock data for customers
  // const mockCostumers: Costumer[] = [
  //   { name: "Flextronics-IPG<" },
  //   { name: "WINTRONIC" },
  //   { name: "AMD" },
  //   { name: "SAE-South America Eletronicse" },
  //   { name: "SAE-South America Eletronicsr" },
  //   { name: "SAE-South America Eletronicsg" },
  //   { name: "SAE-South America Eletronicsp" },
  // ];

  const checkIconStyle = {
    position: "absolute" as "absolute",
    right: "10px",
    fontSize: "24px",
  };

  //To mock the list of Costumers
  useEffect(() => {
    // setInfs(mockCostumers);
    if (infs.length > 0 && selectedCustomer === "") {
      setSelectedCustomer(infs[0].name);
      props.setSetupInf((e: any) => ({
        ...props.setupInf,
        customer: infs[0].name,
      }));
    }
  }, [props]);

  // const getTestCostumers = async () => {
  //   try {
  //     var myHeaders = new Headers();
  //     myHeaders.append("Content-Type", "text/xml");

  //     var raw =
  //       '<?xml version="1.0" encoding="utf-8"?>\r\n' +
  //       '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\r\n' +
  //       "  <soap:Body>\r\n" +
  //       '    <GetListOfCustomers xmlns="http://tempuri.org/" />\r\n' +
  //       "  </soap:Body>\r\n" +
  //       "</soap:Envelope>";

  //     var requestOptions = {
  //       method: "POST",
  //       headers: myHeaders,
  //       body: raw,
  //       redirect: "follow" as RequestRedirect,
  //     };

  //     const response = await fetch(
  //       "http://brzwiptrackws-qa.smartm.internal/WebServices/iLabelling.asmx?op=GetListOfCustomers",
  //       requestOptions
  //     );

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }

  //     const xmlString = await response.text();
  //     const parser = new DOMParser();
  //     const xmlDoc = parser.parseFromString(xmlString, "text/xml");

  //     const setupElements = xmlDoc.getElementsByTagName("SetupiLabelling");
  //     const setupList = [];

  //     for (let i = 0; i < setupElements.length; i++) {
  //       const setupData = {
  //         Cliente:
  //           setupElements[i].getElementsByTagName("Cliente")[0].textContent,
  //         PN_Smart:
  //           setupElements[i].getElementsByTagName("PN_Smart")[0].textContent,
  //         PN_Cliente:
  //           setupElements[i].getElementsByTagName("PN_Cliente")[0].textContent,
  //       };
  //       setupList.push(setupData);
  //     }

  //     const filteredSetupList = setupList.filter(
  //       (customer) => customer.Cliente !== null
  //     );

  //     const customerNames = filteredSetupList.map((customer) => ({
  //       name: customer.Cliente as string,
  //     }));

  //     setInfs(customerNames);

  //     if (customerNames.length > 0 && selectedCustomer === "") {
  //       setSelectedCustomer(customerNames[0].name);
  //       props.setSetupInf((e: any) => ({
  //         ...props.setupInf,
  //         customer: customerNames[0].name,
  //       }));
  //     }
  //   } catch (error) {
  //     console.error("Fetch error:", error);
  //   }
  // };

  const getCostumers = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:5001/WebServices/get_list_of_customers",
        {
          method: "POST",
        }
      );

      if (response.ok) {
        const xmlString = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "text/xml");

        const setupElements = xmlDoc.getElementsByTagName("SetupiLabelling");
        const setupList = [];

        for (let i = 0; i < setupElements.length; i++) {
          const setupData = {
            Cliente:
              setupElements[i].getElementsByTagName("Cliente")[0].textContent,
            PN_Smart:
              setupElements[i].getElementsByTagName("PN_Smart")[0].textContent,
            PN_Cliente:
              setupElements[i].getElementsByTagName("PN_Cliente")[0]
                .textContent,
          };
          setupList.push(setupData);
        }
        const filteredSetupList = setupList.filter(
          (customer) => customer.Cliente !== null
        );
        const customerNames = filteredSetupList.map((customer) => ({
          name: customer.Cliente as string,
        }));
        setInfs(customerNames);
        if (customerNames.length > 0 && selectedCustomer === "") {
          setSelectedCustomer(customerNames[0].name);
          props.setSetupInf((e: any) => ({
            ...props.setupInf,
            customer: customerNames[0].name,
          }));
        }
      }
    } catch (error) {
      console.error("Axios error:", error);
    }
  };

  // const getTestCostumers = async () => {
  //   try {
  //     await axios
  //     .post("http://brzwiptrackws-qa.smartm.internal/WebServices/iLabelling.asmx?op=GetListOfCustomers/", 
  //       `<?xml version="1.0" encoding="utf.-8"?>
  //       <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  //         <soap:Body>
  //           <GetListOfCustomers xmlns="http://tempuri.org/" />
  //         </soap:Body>
  //       </soap:Envelope>`, 
  //       {headers:{
  //         'Content-Type': 'text/xml',
  //       }}
  //     )
  //     .then(async (res: any) => {
  //       const xmlString = await res.text();
  //       const parser = new DOMParser();
  //       const xmlDoc = parser.parseFromString(xmlString, "text/xml");

  //       const setupElements = xmlDoc.getElementsByTagName("SetupiLabelling");
  //       const setupList = [];

  //       for (let i = 0; i < setupElements.length; i++) {
  //         const setupData = {
  //           Cliente:
  //             setupElements[i].getElementsByTagName("Cliente")[0].textContent,
  //           PN_Smart:
  //             setupElements[i].getElementsByTagName("PN_Smart")[0].textContent,
  //           PN_Cliente:
  //             setupElements[i].getElementsByTagName("PN_Cliente")[0]
  //               .textContent,
  //         };
  //         setupList.push(setupData);
  //       }
  //       const filteredSetupList = setupList.filter(
  //         (customer) => customer.Cliente !== null
  //       );
  //       const customerNames = filteredSetupList.map((customer) => ({
  //         name: customer.Cliente as string,
  //       }));
  //       setInfs(customerNames);
  //       if (customerNames.length > 0 && selectedCustomer === "") {
  //         setSelectedCustomer(customerNames[0].name);
  //         props.setSetupInf((e: any) => ({
  //           ...props.setupInf,
  //           customer: customerNames[0].name,
  //         }));
  //       }
  //     })
  //     .catch((res: string) =>
  //       console.log("Error on getting costumers: " + res)
  //     );
  //   } catch (error) {
  //     console.error("Axios error:", error);
  //   }
  // };


  useEffect(() => {
    getCostumers();
    //getCostumersTest();
  }, []);

  const handleItemClick = (name: string) => {
    setSelectedCustomer(name);
    props.setSetupInf((e: any) => ({
      ...props.setupInf,
      customer: name,
    }));
  };

  const getItemStyle = (name: string) => {
    return {
      display: "flex",
      alignItems: "center",
      backgroundColor:
        selectedCustomer === name ? "rgb(64, 64, 216)" : "#F3F3FF",
      minHeight: "35px",
      color: selectedCustomer === name ? "white" : "rgb(64, 64, 216)",
      fontSize: "22px",
      fontFamily: "Motiva Sans, Twemoji, Noto Sans, Helvetica, sans-serif",
      fontWeight: 700,
      margin: "5px",
      border: "1px solid transparent",
      borderRadius: "6px",
      position: "relative" as "relative",
    };
  };

  return (
    <div className="container_inf_setup">
      <div
        className="customer-list-container"
        style={{ height: infs.length > 0 ? "195px" : "100px" }}
      >
        {!(infs.length > 0) && <h4 className="title_no_list">iLabeling</h4>}
        <ul className="customer-list">
          {infs.map((inf, index) => (
            <div key={index} style={{ margin: 5 }}>
              <li
                key={index}
                className={`inf ${
                  selectedCustomer === inf.name ? "selected" : ""
                }`}
                onClick={() => handleItemClick(inf.name)}
                style={getItemStyle(inf.name)}
              >
                <div style={{ marginLeft: "10px" }}>{inf.name}</div>
                {selectedCustomer === inf.name && (
                  <CheckIcon style={checkIconStyle} />
                )}
              </li>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}
