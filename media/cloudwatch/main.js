/* eslint-disable @typescript-eslint/naming-convention */
const vscode = acquireVsCodeApi();

window.addEventListener("load", main);

function main() {

  const ExportLogsButton = document.getElementById("export_logs");
  if (ExportLogsButton) {
    ExportLogsButton.addEventListener("click", ExportLogsClick);
  }

  const PauseTimerButton = document.getElementById("pause_timer");
  if (PauseTimerButton) {
    PauseTimerButton.addEventListener("click", PauseTimerClick);
  }

  const AskAIButton = document.getElementById("ask_ai");
  if (AskAIButton) {
    AskAIButton.addEventListener("click", AskAIClick);
  }

  const SearchTextBox = document.getElementById("search_text");
  if (SearchTextBox) {
    SearchTextBox.addEventListener("keydown", SearchTextBoxKeyDown);
  }

  const FilterTextBox = document.getElementById("filter_text");
  if (FilterTextBox) {
    FilterTextBox.addEventListener("keydown", FilterTextBoxKeyDown);
  }

  const HideTextBox = document.getElementById("hide_text");
  if (HideTextBox) {
    HideTextBox.addEventListener("keydown", HideTextBoxKeyDown);
  }

  const RefreshButton = document.getElementById("refresh");
  if (RefreshButton) {
    RefreshButton.addEventListener("click", RefreshButtonClick);
  }

  const LogStreamSelect = document.getElementById("logstream_select");
  if (LogStreamSelect) {
    LogStreamSelect.addEventListener("change", LogStreamSelectChange);
  }

  const WrapTextCheckbox = document.getElementById("wrap_text");
  if (WrapTextCheckbox) {
    WrapTextCheckbox.addEventListener("change", WrapTextCheckboxChange);
  }

  const UseDateTimeFilterCheckbox = document.getElementById("use_datetime_filter");
  if (UseDateTimeFilterCheckbox) {
    UseDateTimeFilterCheckbox.addEventListener("change", UseDateTimeFilterCheckboxChange);
  }

  const FilterStartDate = document.getElementById("filter_start_date");
  if (FilterStartDate) {
    FilterStartDate.addEventListener("change", DateTimeFilterChange);
  }

  const FilterStartTime = document.getElementById("filter_start_time");
  if (FilterStartTime) {
    FilterStartTime.addEventListener("change", DateTimeFilterChange);
  }

}

function RefreshButtonClick() {
  const SearchTextBox = document.getElementById("search_text");
  const FilterTextBox = document.getElementById("filter_text");
  const HideTextBox = document.getElementById("hide_text");
  const WrapTextCheckbox = document.getElementById("wrap_text");
  const UseDateTimeFilterCheckbox = document.getElementById("use_datetime_filter");
  const FilterStartDate = document.getElementById("filter_start_date");
  const FilterStartTime = document.getElementById("filter_start_time");
  
  vscode.postMessage({
    command: "refresh",
    filter_text: FilterTextBox ? FilterTextBox._value : "",
    hide_text: HideTextBox ? HideTextBox._value : "",
    search_text: SearchTextBox ? SearchTextBox._value : "",
    wrap_text: WrapTextCheckbox ? WrapTextCheckbox.checked : true,
    use_datetime_filter: UseDateTimeFilterCheckbox ? UseDateTimeFilterCheckbox.checked : false,
    filter_start_date: FilterStartDate ? FilterStartDate.value : "",
    filter_start_time: FilterStartTime ? FilterStartTime.value : ""
  });
}

function PauseTimerClick() {
  vscode.postMessage({
    command: "pause_timer"
  });
}

function AskAIClick() {
  vscode.postMessage({
    command: "ask_ai"
  });
}

function ExportLogsClick() {
  vscode.postMessage({
    command: "export_logs"
  });
}

function FilterTextBoxKeyDown(e) {
  if (e.key === "Enter") {
    RefreshButtonClick();
  }
}

function SearchTextBoxKeyDown(e) {
  if (e.key === "Enter") {
    RefreshButtonClick();
  }
}

function HideTextBoxKeyDown(e) {
  if (e.key === "Enter") {
    RefreshButtonClick();
  }
}

function LogStreamSelectChange(e) {
  const selectedValue = e.target.value;
  vscode.postMessage({
    command: "logstream_changed",
    logstream: selectedValue
  });
}

function WrapTextCheckboxChange(e) {
  const SearchTextBox = document.getElementById("search_text");
  const FilterTextBox = document.getElementById("filter_text");
  const HideTextBox = document.getElementById("hide_text");
  const UseDateTimeFilterCheckbox = document.getElementById("use_datetime_filter");
  const FilterStartDate = document.getElementById("filter_start_date");
  const FilterStartTime = document.getElementById("filter_start_time");
  
  vscode.postMessage({
    command: "refresh_nologload",
    wrap_text: e.target.checked,
    search_text: SearchTextBox ? SearchTextBox._value : "",
    filter_text: FilterTextBox ? FilterTextBox._value : "",
    hide_text: HideTextBox ? HideTextBox._value : "",
    use_datetime_filter: UseDateTimeFilterCheckbox ? UseDateTimeFilterCheckbox.checked : false,
    filter_start_date: FilterStartDate ? FilterStartDate.value : "",
    filter_start_time: FilterStartTime ? FilterStartTime.value : ""
  });
}

function UseDateTimeFilterCheckboxChange(e) {
  vscode.postMessage({
    command: "toggle_datetime_filter",
    use_datetime_filter: e.target.checked
  });
}

function DateTimeFilterChange() {
  const FilterStartDate = document.getElementById("filter_start_date");
  const FilterStartTime = document.getElementById("filter_start_time");
  
  vscode.postMessage({
    command: "update_datetime_filter",
    filter_start_date: FilterStartDate ? FilterStartDate.value : "",
    filter_start_time: FilterStartTime ? FilterStartTime.value : ""
  });
}