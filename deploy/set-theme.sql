UPDATE design_config_grid_flat SET theme_theme_id = 6;
UPDATE core_config_data SET value = '6' WHERE path = 'design/theme/theme_id';
INSERT INTO core_config_data (scope, scope_id, path, value)
SELECT 'default', 0, 'design/theme/theme_id', '6'
FROM dual
WHERE NOT EXISTS (SELECT 1 FROM core_config_data WHERE path = 'design/theme/theme_id' AND scope = 'default' AND scope_id = 0);
