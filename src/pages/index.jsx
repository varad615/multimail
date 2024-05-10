import { useState } from "react";
import {
  Button,
  Input,
  Stack,
  Textarea,
  FormControl,
  FormLabel,
  Flex,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter
} from "@chakra-ui/react";
import { FaCog, FaPlus, FaTrash } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";

const EmailSender = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailId, setEmailId] = useState("");
  const [appPassword, setAppPassword] = useState("");
  const [recipients, setRecipients] = useState([""]); // Start with one recipient
  const [subject, setSubject] = useState("");
  const [htmlMessage, setHtmlMessage] = useState("");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleRecipientChange = (index, value) => {
    const updatedRecipients = [...recipients];
    updatedRecipients[index] = value;
    setRecipients(updatedRecipients);
  };

  const addRecipient = () => {
    setRecipients([...recipients, ""]); // Add a new empty field
  };

  const removeRecipient = (index) => {
    if (recipients.length > 1) {
      const updatedRecipients = [...recipients];
      updatedRecipients.splice(index, 1); // Remove the specified recipient
      setRecipients(updatedRecipients);
    }
  };

  const sendEmails = async () => {
    if (!emailId || !appPassword) {
      toast.error("Please provide email ID and app password in the settings");
      return;
    }

    for (const recipient of recipients) {
      if (recipient.trim()) {
        const sendPromise = fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            recipient,
            subject,
            message: htmlMessage,
            emailId, // Use the email ID from the modal
            appPassword // Use the app password from the modal
          })
        });

        sendPromise
          .then((response) => {
            if (response.ok) {
              toast.success(`Email sent to ${recipient}`);
            } else {
              toast.error(`Failed to send email to ${recipient}`);
            }
          })
          .catch((error) => {
            toast.error(
              `Error sending email to ${recipient}: ${error.message}`
            );
          });
      }
    }
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Flex justifyContent="space-between" alignItems="center" p={4}>
        <h1 className="text-2xl font-bold">Multiple Email Sender</h1>{" "}
        {/* Title with settings icon */}
        <IconButton
          aria-label="Settings"
          icon={<FaCog />}
          colorScheme="teal"
          onClick={openModal}
        />
      </Flex>

      <Stack spacing={4} px={4} py={6}>
        <Stack direction="row" justifyContent="space-between" align="center">
          <FormLabel>Recipients</FormLabel>
          <IconButton
            aria-label="Add Recipient"
            icon={<FaPlus />}
            onClick={addRecipient}
            colorScheme="teal"
          />
        </Stack>

        {recipients.map((recipient, index) => (
          <FormControl key={index}>
            <FormLabel>Recipient {index + 1}</FormLabel>
            <Stack direction="row" align="center">
              <Input
                type="text"
                placeholder="Recipient email"
                value={recipient}
                onChange={(e) => handleRecipientChange(index, e.target.value)}
              />
              {recipients.length > 1 && (
                <IconButton
                  aria-label="Remove Recipient"
                  icon={<FaTrash />}
                  onClick={() => removeRecipient(index)}
                  colorScheme="red"
                />
              )}
            </Stack>
          </FormControl>
        ))}

        <FormControl>
          <FormLabel>Subject</FormLabel>
          <Input
            type="text"
            placeholder="Enter the subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>HTML Message</FormLabel>
          <Textarea
            placeholder="Enter your HTML message"
            value={htmlMessage}
            onChange={(e) => setHtmlMessage(e.target.value)}
            rows={6}
          />
        </FormControl>

        <Button colorScheme="teal" onClick={sendEmails}>
          Send Emails
        </Button>
      </Stack>

      {/* Modal for Email ID and App Password */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Email ID</FormLabel>
                <Input
                  type="email"
                  placeholder="Enter your email ID"
                  value={emailId}
                  onChange={(e) => setEmailId(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel>App Password</FormLabel>
                <Input
                  type="password"
                  placeholder="Enter your app password"
                  value={appPassword}
                  onChange={(e) => setAppPassword(e.target.value)}
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={closeModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EmailSender;
