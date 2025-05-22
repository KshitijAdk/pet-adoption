import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Calendar, Clock, CheckCircle, XCircle, MoreHorizontal } from "lucide-react";

const Table = ({
    columns,
    data,
    loading,
    error,
    emptyMessage = "No data found.",
    onRowClick,
    actions = [],
    dropdownActions = [],
    statusConfig = {
        key: 'status',
        icons: {
            approved: { icon: CheckCircle, colorClass: 'bg-green-100 text-green-700 border-green-500' },
            rejected: { icon: XCircle, colorClass: 'bg-red-100 text-red-700 border-red-500' },
            pending: { icon: Clock, colorClass: 'bg-yellow-100 text-yellow-700 border-yellow-500' }
        }
    },
    dateConfig = {
        key: 'createdAt',
        icon: Calendar
    }
}) => {
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const dropdownRefs = useRef({});
    const buttonRefs = useRef({});


    const toggleDropdown = (id, e) => {
        e.stopPropagation();
        setDropdownOpen(dropdownOpen === id ? null : id);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            const clickedOutsideDropdown = Object.values(dropdownRefs.current).every(ref =>
                ref && !ref.contains(event.target)
            );
            const clickedOutsideButton = Object.values(buttonRefs.current).every(ref =>
                ref && !ref.contains(event.target)
            );

            if (clickedOutsideDropdown && clickedOutsideButton) {
                setDropdownOpen(null);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const renderCell = (column, row) => {
        if (column.customRender) {
            return column.customRender(row);
        }

        if (column.key === statusConfig?.key) {
            return renderStatus(row);
        }

        if (column.key === dateConfig?.key) {
            return renderDate(row);
        }

        return row[column.key] || "N/A";
    };

    const renderStatus = (row) => {
        if (!statusConfig || !statusConfig.key) return row[statusConfig?.key] || "N/A";

        const status = row[statusConfig.key]?.toLowerCase();
        const statusInfo = statusConfig.icons[status] || {
            icon: Clock,
            colorClass: 'bg-gray-100 text-gray-700 border-gray-500'
        };
        const Icon = statusInfo.icon;

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center justify-center w-fit mx-auto ${statusInfo.colorClass}`}>
                <Icon size={14} className="mr-1" />
                {status ? status.charAt(0).toUpperCase() + status.slice(1) : "N/A"}
            </span>
        );
    };

    const renderDate = (row) => {
        if (!dateConfig || !dateConfig.key || !row[dateConfig.key]) return "N/A";
        const Icon = dateConfig.icon;

        return (
            <div className="flex items-center justify-center space-x-1">
                <Icon size={12} />
                <span>{new Date(row[dateConfig.key]).toLocaleDateString()}</span>
            </div>
        );
    };

    const handleAction = (action, row, e) => {
        e.stopPropagation();
        setDropdownOpen(null);
        if (action.onClick) {
            action.onClick(row);
        }
    };

    // Dropdown component to be portaled
    const DropdownPortal = ({ rowId, actions, row }) => {
        const dropdownRef = dropdownRefs.current[rowId];
        const buttonRef = buttonRefs.current[rowId];
        const [position, setPosition] = useState({ top: 0, left: 0 });

        useEffect(() => {
            if (buttonRef && dropdownOpen === rowId) {
                const rect = buttonRef.getBoundingClientRect();
                setPosition({
                    top: rect.bottom + window.scrollY,
                    left: rect.left + window.scrollX - 150, // Adjust based on dropdown width
                });
            }
        }, [buttonRef, dropdownOpen, rowId]);

        if (!dropdownOpen || dropdownOpen !== rowId) return null;

        return createPortal(
            <div
                ref={dropdownRef}
                className="fixed z-50 bg-white shadow-lg rounded-lg w-48 py-2 border border-gray-200"
                style={{ top: position.top, left: position.left }}
            >
                {actions.map((action) => (
                    <button
                        key={action.key}
                        onClick={(e) => handleAction(action, row, e)}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-all duration-200"
                    >
                        <action.icon className="w-5 h-5" />
                        <span>{action.label}</span>
                    </button>
                ))}
            </div>,
            document.body
        );
    };

    if (loading) {
        return <div className="p-4 text-center text-gray-500">Loading...</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-red-500">{error}</div>;
    }

    if (!data || data.length === 0) {
        return (
            <div className="p-4">
                {typeof emptyMessage === 'string' ? (
                    <div className="text-center text-gray-500">{emptyMessage}</div>
                ) : (
                    emptyMessage
                )}
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg text-left">
                <thead>
                    <tr className="bg-gray-100 border-b border-gray-300 text-gray-700 text-sm">
                        {columns.map((column) => (
                            <th key={column.key} className="p-4">
                                {column.label}
                            </th>
                        ))}
                        {(actions.length > 0 || dropdownActions.length > 0) && (
                            <th className="p-4 text-center">Actions</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr
                            key={row._id || row.id}
                            className="border-b border-gray-200 hover:bg-gray-50 text-sm cursor-pointer"
                            onClick={() => onRowClick && onRowClick(row)}
                        >
                            {columns.map((column) => (
                                <td key={column.key} className="p-4">
                                    {renderCell(column, row)}
                                </td>
                            ))}
                            {(actions.length > 0 || dropdownActions.length > 0) && (
                                <td className="p-4 text-center">
                                    <div className="flex justify-center space-x-2">
                                        {actions.map((action) => (
                                            <button
                                                key={action.key}
                                                onClick={(e) => handleAction(action, row, e)}
                                                className={`p-1 rounded ${action.className || 'text-gray-500 hover:text-gray-700'}`}
                                                title={action.label}
                                            >
                                                <action.icon size={18} />
                                            </button>
                                        ))}
                                        {dropdownActions.length > 0 && (
                                            <div className="relative">
                                                <button
                                                    ref={el => buttonRefs.current[row._id || row.id] = el}
                                                    className="text-gray-500 hover:text-gray-700 p-1 rounded"
                                                    onClick={(e) => toggleDropdown(row._id || row.id, e)}
                                                    title="More actions"
                                                >
                                                    <MoreHorizontal size={20} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            {data.map((row) => (
                <DropdownPortal
                    key={row._id || row.id}
                    rowId={row._id || row.id}
                    actions={dropdownActions}
                    row={row}
                />
            ))}
        </div>
    );
};


export default Table;