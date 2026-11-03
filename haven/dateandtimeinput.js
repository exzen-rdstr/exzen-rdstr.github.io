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
            document.body.removeChild(input);
        });

        input.addEventListener("blur", () => {
            setTimeout(() => {
                if (document.body.contains(input)) {
                    document.body.removeChild(input);
                }
            }, 100);
        });

        input.click();

        if (input.showPicker) {
            input.showPicker();
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

    getDate() {
        return this.dateValue;
    }

    getTime() {
        return this.timeValue;
    }
}

Scratch.extensions.register(new DateTimePicker());
