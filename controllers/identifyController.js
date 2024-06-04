const prisma=require('../prismaClient');

const handleIdentifyController = async (req, res) => {
    let {email,phoneNumber}=req.body;
    phoneNumber=phoneNumber.toString();
    /**
     * Checking for inputs
     */
    if(!email && !phoneNumber){
      return   res.status(400).send("Please provide a phone Number or Email");
    }

    /**
     * Finding if it is present Already
     */
    let isPresent=await  prisma.contact.findFirst({
        where:{email,phone_number:phoneNumber},
    });

    /**
     * To find value with primary link_precedence
     */
    let findParent=null;

    /**
     * Conditions to find primary and if same fields exists giving them liberty to change them from primary to secondary
     */
   if(isPresent){
       if(isPresent.link_precedence==='secondary'){
           findParent=await prisma.contact.findFirst({
               where:{
                  id:isPresent.linked_id
               }
           });
       }else {
           return res.status(200).send({
               contact:{
                   primaryContactId:isPresent.id,
                   emails:[email],
                   phoneNumbers:[phoneNumber],
                   secondaryContactIds:[]

               }
           });
       }
   } else {
       //case for both same
       let findEmailOnly=await prisma.contact.findFirst({
           where:{email:email,link_precedence:'primary'},
       });
       let findPhoneOnly=await prisma.contact.findFirst({
           where:{phone_number:phoneNumber,link_precedence:'primary'},
       });
       if(findEmailOnly){
           await prisma.contact.updateMany({
               where:{phone_number:phoneNumber},
               data:{
                   link_precedence:'secondary',
                   linked_id:findEmailOnly.id
               }
           });

           findParent=findEmailOnly;

       }
       else if(findPhoneOnly){

           if(findPhoneOnly){
               await prisma.contact.updateMany({
                   where:{email},
                   data:{
                       link_precedence:'secondary',
                       linked_id:findPhoneOnly.id
                   }
               });
               findParent=findPhoneOnly;

           }
       }
       else {
           findParent=await prisma.contact.findFirst({
               where:{
                   OR:[
                       {email:email},
                       {phone_number:phoneNumber}
                   ]
               }
           });
           if(findParent && findParent.linked_id){
               findParent=await prisma.contact.findFirst({
                   where:{
                       id:findParent.linked_id
                   }
               });
           }
       }
       //check if anywhere email/phoneNumber is present
       findEmailOnly=await prisma.contact.findFirst({
           where:{email},
       })
       findPhoneOnly=await prisma.contact.findFirst({
           where:{phone_number:phoneNumber},
       })
       isPresent=findEmailOnly && findPhoneOnly;
   }

    /**
     * Creating new Contact if current is not available
     */
    if(!isPresent){
        if(findParent){
            await prisma.contact.create({
                data:{
                    email,
                    phone_number:phoneNumber,
                    link_precedence:"secondary",
                    linked_id:findParent.id
                }
            });
        } else {
            const data=await prisma.contact.create({
                data:{
                    email,
                    phone_number:phoneNumber,
                    link_precedence:"primary",
                }
            });

            return res.status(200).send({
               contact:{
                   primaryContactId:data.id,
                   emails:[email],
                   phoneNumbers:[phoneNumber],
                   secondaryContactIds:[]

               }
            });
        }

    }

    /**
     * If it is already present create response using primary and secondary keys
     */
    let response={
        contact:{
            primaryContactId:findParent?.id,
            emails:[findParent?.email],
            phoneNumbers:[findParent?.phone_number],
            secondaryContactIds:[]
        }
    }
    const linkedAccounts=await prisma.contact.findMany({
        where:{
            link_precedence:"secondary",
            linked_id:findParent?.id
        }
    });

    /**
     * Inserting secondary accounts
     */
    if(linkedAccounts && linkedAccounts.length>0){
        linkedAccounts.map(val=>{
            response.contact.emails.push(val.email);
            response.contact.phoneNumbers.push(val.phone_number);
            response.contact.secondaryContactIds.push(val.id);
        })
    }
    return res.status(200).send(response);
}


module.exports = handleIdentifyController