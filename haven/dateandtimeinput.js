// Name: Date & Time Input
// ID: datetimeinput
// Description: Prompt the user to pick a date and/or time, then use the values in your project.
// License: MIT

(function (Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('Date & Time Input must run unsandboxed (it needs to show a dialog).');
  }

  const vm = Scratch.vm;

  // ---- State from the most recent prompt ----
  let lastDate = ''; // "YYYY-MM-DD"
  let lastTime = ''; // "HH:MM"
  let lastCancelled = false;

  // ---- Dialog handling ----
  let closeActiveDialog = null;

  /**
   * Shows a modal with a native date/time picker.
   * @param {'date'|'time'|'datetime-local'} type
   * @param {string} promptText
   * @returns {Promise<string|null>} the picked value, or null if cancelled
   */
  const showDialog = (type, promptText) =>
    new Promise((resolve) => {
      // Only one dialog at a time
      if (closeActiveDialog) closeActiveDialog(null);

      const overlay = document.createElement('div');
      overlay.style.cssText =
        'position:fixed;inset:0;z-index:100000;display:flex;align-items:center;' +
        'justify-content:center;background:rgba(0,0,0,0.5);font-family:sans-serif;';

      const box = document.createElement('div');
      box.style.cssText =
        'background:#fff;color:#222;border-radius:12px;padding:20px;min-width:260px;' +
        'max-width:90vw;box-shadow:0 8px 30px rgba(0,0,0,0.35);';

      const label = document.createElement('div');
      label.textContent = promptText;
      label.style.cssText = 'font-size:16px;font-weight:600;margin-bottom:12px;';

      const input = document.createElement('input');
      input.type = type;
      input.style.cssText =
        'width:100%;box-sizing:border-box;font-size:16px;padding:8px;' +
        'border:1px solid #aaa;border-radius:6px;background:#fff;color:#222;';

      const buttons = document.createElement('div');
      buttons.style.cssText = 'display:flex;gap:8px;justify-content:flex-end;margin-top:16px;';

      const makeButton = (text, primary) => {
        const b = document.createElement('button');
        b.textContent = text;
        b.style.cssText =
          'font-size:14px;padding:8px 16px;border-radius:6px;cursor:pointer;border:1px solid ' +
          (primary ? '#4c97ff;background:#4c97ff;color:#fff;' : '#aaa;background:#f2f2f2;color:#222;');
        return b;
      };

      const cancelBtn = makeButton('Cancel', false);
      const okBtn = makeButton('OK', true);
      buttons.append(cancelBtn, okBtn);
      box.append(label, input, buttons);
      overlay.append(box);

      const finish = (value) => {
        if (!closeActiveDialog) return;
        closeActiveDialog = null;
        document.removeEventListener('keydown', onKey, true);
        overlay.remove();
        resolve(value);
      };

      const confirm = () => {
        if (!input.value) {
          // Nothing chosen yet: nudge the user instead of returning empty
          input.style.borderColor = '#e33';
          input.focus();
          return;
        }
        finish(input.value);
      };

      const onKey = (e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          e.stopPropagation();
          finish(null);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          e.stopPropagation();
          confirm();
        }
      };

      okBtn.addEventListener('click', confirm);
      cancelBtn.addEventListener('click', () => finish(null));
      overlay.addEventListener('mousedown', (e) => {
        if (e.target === overlay) finish(null);
      });
      document.addEventListener('keydown', onKey, true);

      closeActiveDialog = finish;
      document.body.appendChild(overlay);
      input.focus();
    });

  // Close any open dialog when the project is stopped
  vm.runtime.on('PROJECT_STOP_ALL', () => {
    if (closeActiveDialog) closeActiveDialog(null);
  });

  const part = (str, sep, index) => {
    if (!str) return '';
    const n = Number(str.split(sep)[index]);
    return Number.isNaN(n) ? '' : n;
  };

  class DateTimeInput {
    getInfo() {
      return {
        id: 'datetimeinput',
        name: 'Date & Time Input',
        color1: '#3d8fd1',
        color2: '#3379b0',
        color3: '#2b6797',
        blocks: [
          {
            blockType: Scratch.BlockType.LABEL,
            text: 'Ask the user',
          },
          {
            opcode: 'askDate',
            blockType: Scratch.BlockType.REPORTER,
            text: 'ask for date [PROMPT]',
            arguments: {
              PROMPT: { type: Scratch.ArgumentType.STRING, defaultValue: 'Pick a date' },
            },
          },
          {
            opcode: 'askTime',
            blockType: Scratch.BlockType.REPORTER,
            text: 'ask for time [PROMPT]',
            arguments: {
              PROMPT: { type: Scratch.ArgumentType.STRING, defaultValue: 'Pick a time' },
            },
          },
          {
            opcode: 'askDateTime',
            blockType: Scratch.BlockType.REPORTER,
            text: 'ask for date and time [PROMPT]',
            arguments: {
              PROMPT: { type: Scratch.ArgumentType.STRING, defaultValue: 'Pick a date and time' },
            },
          },
          '---',
          {
            blockType: Scratch.BlockType.LABEL,
            text: 'Last answer',
          },
          {
            opcode: 'lastWasCancelled',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'last prompt cancelled?',
          },
          {
            opcode: 'lastDateValue',
            blockType: Scratch.BlockType.REPORTER,
            text: 'last date (YYYY-MM-DD)',
          },
          {
            opcode: 'lastTimeValue',
            blockType: Scratch.BlockType.REPORTER,
            text: 'last time (HH:MM)',
          },
          {
            opcode: 'lastYear',
            blockType: Scratch.BlockType.REPORTER,
            text: 'last year',
          },
          {
            opcode: 'lastMonth',
            blockType: Scratch.BlockType.REPORTER,
            text: 'last month',
          },
          {
            opcode: 'lastDay',
            blockType: Scratch.BlockType.REPORTER,
            text: 'last day',
          },
          {
            opcode: 'lastHour',
            blockType: Scratch.BlockType.REPORTER,
            text: 'last hour (24h)',
          },
          {
            opcode: 'lastMinute',
            blockType: Scratch.BlockType.REPORTER,
            text: 'last minute',
          },
        ],
      };
    }

    // ---- Prompt blocks ----

    async askDate(args) {
      const result = await showDialog('date', Scratch.Cast.toString(args.PROMPT));
      lastCancelled = result === null;
      if (lastCancelled) return '';
      lastDate = result;
      return result;
    }

    async askTime(args) {
      const result = await showDialog('time', Scratch.Cast.toString(args.PROMPT));
      lastCancelled = result === null;
      if (lastCancelled) return '';
      lastTime = result.slice(0, 5);
      return lastTime;
    }

    async askDateTime(args) {
      const result = await showDialog('datetime-local', Scratch.Cast.toString(args.PROMPT));
      lastCancelled = result === null;
      if (lastCancelled) return '';
      const [d, t] = result.split('T');
      lastDate = d;
      lastTime = (t || '').slice(0, 5);
      return `${lastDate} ${lastTime}`;
    }

    // ---- Last-answer blocks ----

    lastWasCancelled() {
      return lastCancelled;
    }
    lastDateValue() {
      return lastDate;
    }
    lastTimeValue() {
      return lastTime;
    }
    lastYear() {
      return part(lastDate, '-', 0);
    }
    lastMonth() {
      return part(lastDate, '-', 1);
    }
    lastDay() {
      return part(lastDate, '-', 2);
    }
    lastHour() {
      return part(lastTime, ':', 0);
    }
    lastMinute() {
      return part(lastTime, ':', 1);
    }
  }

  Scratch.extensions.register(new DateTimeInput());
})(Scratch);
