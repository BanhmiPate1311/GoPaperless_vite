/* eslint-disable react/prop-types */
import { useState } from "react";
import Tab from "@mui/material/Tab";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import DrawIcon from "@mui/icons-material/Draw";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import UploadIcon from "@mui/icons-material/Upload";
import { Button, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

export default function ModalSingingImage({
  isShowModalSignImage,
  setShowModalSignImage,
}) {
  const [valueSignImage, setValueSignImage] = useState(0);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  return (
    <Modal
      className="custom-modal-no-padding"
      open={isShowModalSignImage}
      onClose={() => setShowModalSignImage(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={isShowModalSignImage}>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-2xl w-[499px] overflow-hidden">
          <div className="bg-[#F3FBFF] py-2 px-4 ">
            <TabContext value={0}>
              <div className="flex justify-between items-center">
                <div className="flex">
                  <TabList value={0}>
                    <Tab
                      value={0}
                      label={<span className="font-bold">SIGN DOCUMENT</span>}
                    ></Tab>
                  </TabList>
                </div>
                <CloseIcon onClick={() => setShowModalSignImage(false)} />
              </div>
              <TabPanel value={0} className="p-0">
                <TabContext value={valueSignImage}>
                  <TabList
                    value={valueSignImage}
                    onChange={(event, newValue) => {
                      setValueSignImage(newValue);
                    }}
                    variant="fullWidth"
                    sx={{
                      marginTop: "20px",
                    }}
                  >
                    <Tab
                      value={0}
                      label={
                        <span className="font-bold">
                          <KeyboardIcon /> Text
                        </span>
                      }
                    ></Tab>
                    <Tab
                      value={1}
                      label={
                        <span className="font-bold">
                          <DrawIcon /> Image
                        </span>
                      }
                    ></Tab>
                    <Tab
                      value={2}
                      label={
                        <span className="font-bold">
                          <UploadIcon /> Upload
                        </span>
                      }
                    ></Tab>
                  </TabList>
                  <TabPanel value={0} className="p-0">
                    <form onSubmit={handleSubmit((data) => console.log(data))}>
                      {" "}
                      <TextField
                        size="small"
                        id="outlined-basic"
                        label="Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        {...register("text", { required: true })}
                        error={errors.text}
                        inputProps={{ maxLength: 32 }}
                      />
                      <div className="pb-8 border border-[#357EEB] rounded-[6px]">
                        <div className="w-full py-8 flex items-center border-b-2 border-[#357EEB] border-dashed">
                          <div className="mx-auto font-moon-dance text-[2rem] h-[40px]">
                            {watch("text") || ""}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <h2 className="font-medium">Contact Information</h2>
                        <TextField
                          size="small"
                          label="Email"
                          fullWidth
                          className="mt-2"
                          variant="outlined"
                          {...register("email", { required: true })}
                        />
                      </div>
                      <div className="mt-4">
                        <h2 className="font-medium">Include Text</h2>
                        <FormGroup className="grid grid-cols-2 gap-4 mt-2">
                          <div>
                            <FormControlLabel
                              className="w-full"
                              control={<Checkbox />}
                              label="Name"
                              {...register("includeName")}
                            />
                            <FormControlLabel
                              className="w-full"
                              control={<Checkbox />}
                              label="Date"
                              {...register("includeDate")}
                            />
                            <FormControlLabel
                              className="w-full"
                              control={<Checkbox />}
                              label="Logo"
                              {...register("includeLogo")}
                            />
                            <FormControlLabel
                              className="w-full"
                              control={<Checkbox />}
                              label="Reason"
                              {...register("includeReason")}
                            />
                          </div>
                          <div>
                            <FormControlLabel
                              className="w-full"
                              control={<Checkbox />}
                              label="Distinguished Name"
                              {...register("includeDistinguishedName")}
                            />
                            <FormControlLabel
                              className="w-full"
                              control={<Checkbox />}
                              label="IText Version"
                              {...register("includeITextVersion")}
                            />
                            <FormControlLabel
                              className="w-full"
                              control={<Checkbox />}
                              label="Location"
                              {...register("includeLocation")}
                            />
                            <FormControlLabel
                              className="w-full"
                              control={<Checkbox />}
                              label="Labels"
                              {...register("includeLabels")}
                            />
                          </div>
                        </FormGroup>
                      </div>
                    </form>
                  </TabPanel>
                </TabContext>
              </TabPanel>
            </TabContext>
          </div>
          <footer className="bg-white py-4 px-4 space-x-2 flex justify-end">
            <Button
              variant="contained"
              className="bg-white rounded-[2rem] text-black font-medium"
              onClick={() => setShowModalSignImage(false)}
            >
              Close
            </Button>
            <Button
              variant="contained"
              className="bg-[#3B82F6] rounded-[2rem] text-white font-medium"
              onClick={() => setShowModalSignImage(false)}
            >
              Continue
            </Button>
          </footer>
        </div>
      </Fade>
    </Modal>
  );
}
