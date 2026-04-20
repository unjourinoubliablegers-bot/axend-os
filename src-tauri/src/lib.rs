use serde_json::Value;
use std::fs;
use std::path::PathBuf;
use tauri::Manager;

fn sanitize_area(area: &str) -> Result<&str, String> {
    match area {
        "state" | "proofs" | "handoffs" => Ok(area),
        _ => Err(format!("Unsupported area: {area}")),
    }
}

fn sanitize_name(name: &str) -> Result<String, String> {
    if name.is_empty() {
        return Err("Document name cannot be empty".into());
    }

    if name
        .chars()
        .all(|c| c.is_ascii_alphanumeric() || c == '-' || c == '_')
    {
        Ok(name.to_string())
    } else {
        Err(format!("Unsafe document name: {name}"))
    }
}

fn base_axend_dir(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    let base = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("app_data_dir unavailable: {e}"))?;
    let dir = base.join("axend-os");
    fs::create_dir_all(&dir).map_err(|e| format!("Cannot create base AXEND dir: {e}"))?;
    Ok(dir)
}

fn ensure_area_dir(app: &tauri::AppHandle, area: &str) -> Result<PathBuf, String> {
    let dir = base_axend_dir(app)?.join(sanitize_area(area)?);
    fs::create_dir_all(&dir).map_err(|e| format!("Cannot create area dir: {e}"))?;
    Ok(dir)
}

#[tauri::command]
fn load_json_document(
    app: tauri::AppHandle,
    area: String,
    name: String,
    fallback: Value,
) -> Result<Value, String> {
    let dir = ensure_area_dir(&app, &area)?;
    let path = dir.join(format!("{}.json", sanitize_name(&name)?));

    if !path.exists() {
        let pretty = serde_json::to_string_pretty(&fallback)
            .map_err(|e| format!("Cannot serialize fallback: {e}"))?;
        fs::write(&path, pretty).map_err(|e| format!("Cannot seed JSON document: {e}"))?;
        return Ok(fallback);
    }

    let raw = fs::read_to_string(&path).map_err(|e| format!("Cannot read JSON document: {e}"))?;
    serde_json::from_str(&raw).map_err(|e| format!("Cannot parse JSON document: {e}"))
}

#[tauri::command]
fn save_json_document(
    app: tauri::AppHandle,
    area: String,
    name: String,
    value: Value,
) -> Result<String, String> {
    let dir = ensure_area_dir(&app, &area)?;
    let path = dir.join(format!("{}.json", sanitize_name(&name)?));
    let pretty = serde_json::to_string_pretty(&value)
        .map_err(|e| format!("Cannot serialize JSON document: {e}"))?;
    fs::write(&path, pretty).map_err(|e| format!("Cannot save JSON document: {e}"))?;
    Ok(path.display().to_string())
}

#[tauri::command]
fn read_text_document(
    app: tauri::AppHandle,
    area: String,
    name: String,
    fallback: String,
) -> Result<String, String> {
    let dir = ensure_area_dir(&app, &area)?;
    let path = dir.join(format!("{}.md", sanitize_name(&name)?));

    if !path.exists() {
        fs::write(&path, &fallback).map_err(|e| format!("Cannot seed text document: {e}"))?;
        return Ok(fallback);
    }

    fs::read_to_string(&path).map_err(|e| format!("Cannot read text document: {e}"))
}

#[tauri::command]
fn write_text_document(
    app: tauri::AppHandle,
    area: String,
    name: String,
    content: String,
) -> Result<String, String> {
    let dir = ensure_area_dir(&app, &area)?;
    let path = dir.join(format!("{}.md", sanitize_name(&name)?));
    fs::write(&path, content).map_err(|e| format!("Cannot save text document: {e}"))?;
    Ok(path.display().to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            load_json_document,
            save_json_document,
            read_text_document,
            write_text_document
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
