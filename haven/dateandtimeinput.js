class DateTimeInput {
    constructor() {
        this.dateInput = "";
        this.timeInput = "";
    }

    getInfo() {
        return {
            id: 'datetimeinput',
            name: 'Date & Time Input',
            color1: '#4A90E2',
            color2: '#357ABD',
            blocks: [
                {
                    opcode: 'askDate',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'ask for date'
                },
                {
                    opcode: 'askTime',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'ask for time'
                },
                {
                    opcode: 'askDateTime',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'ask for date and time'
                },
                {
                    opcode: 'getDate',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'date input'
                },
                {
                    opcode: 'getTime',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'time input'
                }
            ]
        };
    }

    askDate() {
        const input = prompt(
            "Enter a date (example: 11/2/2026)"
        );

        if (input !== null) {
            this.dateInput = input;
        }
    }

    askTime() {
        const input = prompt(
            "Enter a time (example: 5:30 PM)"
        );

        if (input !== null) {
            this.timeInput = input;
        }
    }

    askDateTime() {
        const date = prompt(
            "Enter a date (example: 11/2/2026)"
        );

        if (date !== null) {
            this.dateInput = date;
        }

        const time = prompt(
            "Enter a time (example: 5:30 PM)"
        );

        if (time !== null) {
            this.timeInput = time;
        }
    }

    getDate() {
        return this.dateInput;
    }

    getTime() {
        return this.timeInput;
    }
}

Scratch.extensions.register(new DateTimeInput());
