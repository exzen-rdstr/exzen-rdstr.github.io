class DateTimePicker {
    constructor() {
        this.dateValue = "";
        this.timeValue = "";
    }

    getInfo() {
        return {
            id: "datetimepicker",
            name: "Date & Time Picker",
            color1: "#4A90E2",
            color2: "#357ABD",
            blocks: [
                {
                    opcode: "pickDate",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "pick date"
                },
                {
                    opcode: "pickTime",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "pick time"
                },
                {
                    opcode: "resetValues",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "reset date & time"
                },
                {
                    opcode: "resetDate",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "reset date"
                },
                {
                    opcode: "resetTime",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "reset time"
                },
                {
                    opcode: "getDate",
                    blockType: Scratch.BlockType.REPORTER,
                    text: "selected date"
                },
                {
                    opcode: "getTime",
                    blockType: Scratch.BlockType.REPORTER,
                    text: "selected time"
                }
            ]
        };
    }

    createPicker(type, callback) {
        const input = document.createElement("input");

        input.type = type;

        input.style.position = "fixed";
        input.style.left = "-9999px";
        input.style.opacity = "0";

        document.body.appendChild(input);

        input.addEventListener("change", () => {
            callback(input.value);

            if (document.body.contains(input)) {
                document.body.removeChild(input);
            }
        });

        input.addEventListener("blur", () => {
            setTimeout(() => {
                if (document.body.contains(input)) {
                    document.body.removeChild(input);
                }
            }, 100);
        });

        if (typeof input.showPicker === "function") {
            input.showPicker();
        } else {
            input.click();
        }
    }

    pickDate() {
        this.createPicker("date", value => {
            this.dateValue = value;
        });
    }

    pickTime() {
        this.createPicker("time", value => {
            this.timeValue = value;
        });
    }

    resetValues() {
        this.dateValue = "";
        this.timeValue = "";
    }

    resetDate() {
        this.dateValue = "";
    }

    resetTime() {
        this.timeValue = "";
    }

    getDate() {
        return this.dateValue;
    }

    getTime() {
        return this.timeValue;
    }
}

Scratch.extensions.register(new DateTimePicker());
